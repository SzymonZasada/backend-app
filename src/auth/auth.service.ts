import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/database/services/users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async register(dto: AuthDto) {
        const hashPassword = await this.hashData(dto.password);
        const customId = uuidv4();
        const newUser = {
            email: dto.email,
            password: hashPassword,
            userId: customId
        }
        await this.usersService.createUser(newUser);
    }

    async authenticate(dto: AuthDto): Promise<Tokens> {
        const user = await this.usersService.findUser(dto.email);
        const passwordMatches = await bcrypt.compare(dto.password, user.password);

        if (!passwordMatches) {
            throw new ForbiddenException('Wrong password or email')
        }
        const tokens = await this.getTokens(user.userId, user.email)
        const updatedUser = await this.usersService.updateRefreshToken(user.userId, tokens.refresh_token)

        if (!updatedUser) {
            throw new ForbiddenException('Wrong user')
        }
        return tokens
    }

    async logout(userId: string) {
        const updatedUser = await this.usersService.updateRefreshToken(userId, null)
        if (!updatedUser) {
            throw new ForbiddenException('Wrong user')
        }
    }

    async refreshToken(userId: string, refreshToken: string) {
        const user = await this.usersService.findUserById(userId);
        if (user.refreshToken !== refreshToken) {
            throw new ForbiddenException('Access denied')
        }
        const tokens = await this.getTokens(user.userId, user.email)
        const updatedUser = await this.usersService.updateRefreshToken(user.userId, tokens.refresh_token)

        if (!updatedUser) {
            throw new ForbiddenException('Wrong user')
        }

        return tokens
    }


    async hashData(data: string): Promise<string> {
        const hash = await bcrypt.hash(data, 10)
        return hash
    }

    async getTokens(userId: string, email: string): Promise<Tokens> {
        const accessToken = await this.jwtService.signAsync({
            sub: userId,
            email
        }, { secret: 'secret', expiresIn: 60 })

        const refreshToken = await this.jwtService.signAsync({
            sub: userId,
            email
        }, { secret: 'secret1', expiresIn: 60 * 60 * 15 })

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }
}
