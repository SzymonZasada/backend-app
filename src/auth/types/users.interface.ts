import { ObjectId } from "mongoose";

export default interface UserInterface {
    _id?: ObjectId;
    email: string;
    password: string;
    refreshToken?: string | null;
}