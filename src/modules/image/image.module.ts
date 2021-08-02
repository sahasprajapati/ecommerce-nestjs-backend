import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/modules/image/entity/image.entity';
import { ImageService } from './image.service';
import { ImagekitService } from './imagekit/imagekit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImageService, ImagekitService],
  exports: [ImageService],
})
export class ImageModule {}
