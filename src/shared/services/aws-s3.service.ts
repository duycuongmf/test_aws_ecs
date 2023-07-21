import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class AWSS3Service {
  private readonly s3 = null;

  constructor(private configService: ApiConfigService) {
    this.s3 = new S3Client(this.configService.s3Config);
  }

  public async getSignedUrl(_key) {
    if (!_key) return null;
    return await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: this.configService.s3Config.bucket,
        Key: _key,
      }),
      { expiresIn: this.configService.uploadConfig.expiredSignedUrl }
    );
  }

  public delete(_key) {
    if (!_key) return false;
    return this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.configService.s3Config.bucket,
        Key: _key,
      })
    );
  }
}
