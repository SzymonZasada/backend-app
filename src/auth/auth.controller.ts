import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { RefrestTokenGuard } from 'src/common/guards/refresh_token.guard';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/tokens.type';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Public()
    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() dto: AuthDto): Promise<void> {
        return this.authService.register(dto)
    }


    @Public()
    @Post('/authenticate')
    @HttpCode(HttpStatus.OK)
    authenticate(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.authenticate(dto)
    }


    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: ObjectId,): Promise<void> {
        return this.authService.logout(userId)
    }


    @Public()
    @UseGuards(RefrestTokenGuard)
    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    refreshToken(
        @GetCurrentUserId() userId: ObjectId,
        @GetCurrentUser('refreshToken') refreshToken: string): Promise<Tokens> {
        return this.authService.refreshToken(userId, refreshToken)
    }


    @Post('/test')
    @HttpCode(HttpStatus.OK)
    test(@GetCurrentUserId() userId: ObjectId,) {
        console.log(userId)
        return { test: 'token-test' }
    }
}
