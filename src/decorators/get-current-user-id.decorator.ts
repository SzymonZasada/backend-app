import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import mongoose, { ObjectId } from "mongoose";

export const GetCurrentUserId = createParamDecorator((data: undefined, context: ExecutionContext): ObjectId => {
    const request = context.switchToHttp().getRequest();
    const id = mongoose.Types.ObjectId.createFromHexString(request.user.sub) as any as ObjectId
    return id
})