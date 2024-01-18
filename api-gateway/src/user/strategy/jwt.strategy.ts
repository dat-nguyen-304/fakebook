import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE_NAME, UserServiceClient } from 'proto/auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') implements OnModuleInit {
    private userService: UserServiceClient;

    constructor(
        private config: ConfigService,
        @Inject('user') private client: ClientGrpc
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET')
        });
    }

    onModuleInit() {
        this.userService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    async validate(id: string) {
        const user = await this.userService.findOneUser({ id });
        console.log({ user });
        return user;
    }
}
