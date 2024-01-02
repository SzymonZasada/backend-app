import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import UserInterface from 'src/auth/types/users.interface';
import { Users } from 'src/database/schema/users.schema';

@Injectable()
export class UsersService {

    constructor(@InjectModel('Users') private readonly userModel: Model<Users>) { }


    async createUser(user: UserInterface): Promise<UserInterface> {
        const userExists = await this.userModel.findOne({ email: user.email });

        if (userExists) {
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

    async findUserById(userId: ObjectId): Promise<UserInterface> {
        const user = await this.userModel.findOne({ _id: userId });

        if (!user) {
            throw new ForbiddenException('User not exists')
        }

        return user
    }

    async updateRefreshToken(userId: ObjectId, refreshToken: string | null): Promise<UserInterface> {
        const user = await this.userModel.findOneAndUpdate(
            { _id: userId },
            { refreshToken: refreshToken },
            { new: true }
        );
        return user
    }

}
