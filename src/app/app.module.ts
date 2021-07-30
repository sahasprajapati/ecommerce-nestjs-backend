import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/modules/config/configuration';
import {
  EnvironmentVariables,
  validate,
} from 'src/modules/config/env.validation';
import { AuthModule } from './../modules/auth/auth.module';
import { CategoryModule } from './../modules/category/category.module';
import { ProductsModule } from './../modules/products/products.module';
import { UserModule } from './../modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    // CategoryModule,
    ConfigModule.forRoot({
      load: [configuration],
      validate,
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
    //     type: 'postgres',
    //     // url: configService.get('POSTGRES_URL'),

    //     host: configService.get('POSTGRES_HOST'),
    //     port: configService.get('POSTGRES_PORT'),
    //     username: configService.get('POSTGRES_USER'),
    //     password: configService.get('POSTGRES_PASSWORD'),
    //     database: configService.get('POSTGRES_DB'),
    //     // entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //     autoLoadEntities: true,
    //     synchronize:
    //       configService.get('NODE_ENV') === 'production' ? false : true,
    //   }),
    //   inject: [ConfigService],
    // }),
    // AuthModule,
    // UserModule,
    // ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
