import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UserInterface from 'src/auth/types/users.interface';
import { Users } from 'src/database/schema/users.schema';

@Injectable()
export class UsersService {

    constructor(@InjectModel('Users') private readonly userModel: Model<Users>) { }


    async createUser(user: UserInterface): Promise<UserInterface> {
        const userExists = await this.userModel.findOne({ email: user.email });

        const userIdExists = await this.userModel.findOne({ userId: user.userId });

        if (userExists || userIdExists) {
            throw new ConflictException('Email already exists');
        }

        const newUser = new this.userModel(user);
        return newUser.save();

    }

    async findUser(email: string): Promise<Users> {
        const user = await this.userModel.findOne({ email: email });

        if (!user) {
            throw new ForbiddenException('User not exists')
        }

        return user
    }

    async findUserById(userId: string): Promise<Users> {
        const user = await this.userModel.findOne({ userId: userId });

        if (!user) {
            throw new ForbiddenException('User not exists')
        }

        return user
    }

    async updateRefreshToken(userId: string, refreshToken: string | null): Promise<Users> {
        const user = await this.userModel.findOneAndUpdate(
            { userId: userId },
            { refreshToken: refreshToken },
            { new: true }
        );
        return user
    }

}
