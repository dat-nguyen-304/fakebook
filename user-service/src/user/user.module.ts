import { Module } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { UserController } from '@user/user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'WS_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('WS_SERVICE_HOST'),
            port: configService.get<number>('WS_SERVICE_PORT')
          }
        }),
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
