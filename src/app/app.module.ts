import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/modules/config/configuration';
import { validate } from 'src/modules/config/env.validation';
import { ImageModule } from 'src/modules/image/image.module';
import * as ormconfig from 'src/ormconfig';
import { AuthModule } from './../modules/auth/auth.module';
import { CategoryModule } from './../modules/category/category.module';
import { ProductsModule } from './../modules/products/products.module';
import { UserModule } from './../modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    CategoryModule,
    ConfigModule.forRoot({
      load: [configuration],
      validate,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(
          ormconfig,
          // , { autoLoadEntities: true }
        ),
    }),
    AuthModule,
    UserModule,
    ProductsModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
