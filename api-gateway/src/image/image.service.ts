import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class ImageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }

  // Upload image using Cloudinary SDK
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'image' }, (error, result: UploadApiResponse | UploadApiErrorResponse) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('Failed to upload image'));
          }
        })
        .end(file.buffer);
    });
  }

  async uploadResizedImage(publicId: string) {
    return cloudinary.url(publicId, {
      resource_type: 'image',
      width: 200,
      height: 200,
      crop: 'fill',
      gravity: 'center'
    });
  }

  // Optional: Delete image from Cloudinary
  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }

  // Optional: Generate URL for image with transformations
  getImageUrl(publicId: string, options: any): string {
    return cloudinary.url(publicId, options);
  }
}
