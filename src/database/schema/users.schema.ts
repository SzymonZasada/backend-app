import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';


export type UsersDocument = HydratedDocument<Users>

@Schema()
export class Users extends Document {
    @Prop({ required: true, index: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, index: true, unique: true })
    userId: string;

    @Prop()
    refreshToken?: string | null | undefined;
}

export const UsersSchema = SchemaFactory.createForClass(Users);