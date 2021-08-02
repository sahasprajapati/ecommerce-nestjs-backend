import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReadStream } from 'fs';
import ImageKit from 'imagekit';
import { UploadResponse } from 'imagekit/dist/libs/interfaces';
import { EnvironmentVariables } from 'src/modules/config/env.validation';

@Injectable()
export class ImagekitService {
  imageKit: ImageKit;
  logger = new Logger('ImageKitService');
  constructor(private config: ConfigService<EnvironmentVariables>) {
    this.logger.log(this.config.get('IMAGEKIT_PUBLIC_KEY'));
    this.imageKit = new ImageKit({
      publicKey: this.config.get('IMAGEKIT_PUBLIC_KEY'),
      privateKey: this.config.get('IMAGEKIT_PRIVATE_KEY'),
      urlEndpoint: this.config.get('IMAGEKIT_URL'),
    });
  }

  async upload(
    image: string | Buffer | ReadableStream<any> | ReadStream,
    name: string,
  ): Promise<UploadResponse> {
    const result = await this.imageKit
      .upload({
        file: image,
        fileName: name,
      })
      .catch((err: Error) => {
        this.logger.error(err, err.stack);
        throw new Error('Uploading of Image failed');
      });

    return result;
  }

  async delete(fileId: string) {
    return await this.imageKit.deleteFile(fileId).catch((error: Error) => {
      this.logger.error(error, error.stack);

      throw new Error('Deletion of Image failed');
    });
  }

  async deleteFiles(...fileIds: string[]) {
    return await this.imageKit.bulkDeleteFiles(fileIds);
  }
}
