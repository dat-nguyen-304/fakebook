import { Module } from '@nestjs/common';

import { User } from './auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserService } from './auth.service';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from '../../proto/auth';
import { JwtStrategy } from './strategy/index';
import { ConfigService } from '@nestjs/config';

@Module({
    // imports: [TypeOrmModule.forFeature([User])],
    imports: [
        ClientsModule.register([
            {
                name: 'user',
                transport: Transport.GRPC,
                options: {
                    package: USER_PACKAGE_NAME,
                    protoPath: join(__dirname, '../../../proto/auth.proto')
                }
            }
        ]),
        JwtModule.register({})
    ],
    providers: [UserService, JwtStrategy, ConfigService],
    controllers: [UserController]
})
export class UserModule {}
