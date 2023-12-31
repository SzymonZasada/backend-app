import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from './schema/users.schema';
import { UsersService } from './services/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService]
})
export class DatabaseModule { }
