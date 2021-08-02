import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateImages } from './dto/createImage.dto';
import { UpdateImages } from './dto/updateImage.dto';
import { Image } from './entity/image.entity';
import { ImagekitService } from './imagekit/imagekit.service';

@Injectable()
export class ImageService {
  logger = new Logger('ImageService');
  constructor(
    private imageKitService: ImagekitService,
    @InjectRepository(Image) private imageRepo: Repository<Image>,
  ) {}

  async upload(images: CreateImages[]) {
    const uploadedImages = images
      ? images.map(async (image) => {
          const result = await this.imageKitService
            .upload(image.url, image.name)
            .catch((error: Error) => {
              this.logger.error(error, error.stack);
            });

          console.log(result);
          if (result) {
            console.log('OK');
            const img = new Image();

            img.name = result.name;
            img.url = result.url;
            img.thumbnailUrl = result.thumbnailUrl;
            img.fileId = result.fileId;

            return await this.imageRepo.save(img);
          }
        })
      : [];
    return Promise.all(uploadedImages);
  }

  async update(images: UpdateImages[], ids: string[]) {
    const updatedImages = images
      ? images.map(async (image) => {
          if (!image.fileId || image.fileId === null) {
            console.log(image);
            const result = await this.imageKitService
              .upload(image.url, image.name)
              .catch((error: Error) => {
                this.logger.error(error, error.stack);
              });

            if (result) {
              const img = new Image();

              img.name = result.name;
              img.url = result.url;
              img.thumbnailUrl = result.thumbnailUrl;
              img.fileId = result.fileId;

              return await this.imageRepo.save(img);
            }
          } else {
            if (ids.includes(image.fileId)) {
              ids = ids.filter((id) => id !== image.fileId);
              return await this.imageRepo.findOne({
                fileId: image.fileId,
              });
            }
          }
        })
      : [];

    console.log(ids);
    if (ids.length > 0) {
      // console.log(await Promise.all(updatedImages));
      this.imageKitService.deleteFiles(...ids);
      ids.map((fileId) => {
        this.imageRepo.delete({
          fileId: fileId,
        });
      });
    }

    return Promise.all(updatedImages);

    // Old ids
    // var removeIds:string[] = []
    // const toUploadImages = [];
    // images.forEach((image) => {
    //   if (image.fileId && image.id) {
    //     if(!ids.includes(image.fileId)){
    //       removeIds.push(image.fileId)
    //     }else{
    //       product.images.push({
    //         image.name,image.url, image.thumbnailUrl,image.fileID
    //       })
    //     }
    //   } else {
    //     toUploadImages.push(image);
    //   }
    // });
    // const uploadedImages: Image[] = [];
    // toUploadImages.map(async (image) => {
    //   const result = await this.imageKitService.upload(image.image, image.name);
    //   uploadedImages.push({
    //     name: result.name,
    //     url: result.url,
    //     thumbnailUrl: result.thumbnailUrl,
    //     fileId: result.fileId,
    //   });
    // });
  }
  async delete(fileId: string) {
    await this.imageKitService.delete(fileId);
    await this.imageRepo.delete({
      fileId: fileId,
    });
  }

  async deleteAll(...fileIds: string[]) {
    await this.imageKitService.deleteFiles(...fileIds);
    fileIds.forEach(async (fileId) => {
      await this.imageRepo.delete({
        fileId: fileId,
      });
    });
  }
}
