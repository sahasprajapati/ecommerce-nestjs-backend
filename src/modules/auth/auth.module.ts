import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentVariables } from '../config/env.validation';
import { UserModule } from './../user/user.module';
import { AuthenticationController } from './auth.controller';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { JWTStrategy } from './strategy/jwt.strategy';
import { TokensService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokensRepository]),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '5m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthenticationController],
  providers: [TokensService, JWTStrategy],
})
export class AuthModule {}
