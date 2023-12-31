import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class RefrestTokenGuard extends AuthGuard('jwt-refresh') {
    constructor() {
        super();
    }
}