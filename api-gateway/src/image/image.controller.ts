import { Controller, Post, UploadedFile, UseInterceptors, Delete, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Handle file upload using Multer
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.imageService.uploadImage(file); // Upload to Cloudinary
  }

  @Delete('delete/:publicId')
  async deleteImage(@Param('publicId') publicId: string) {
    return await this.imageService.deleteImage(publicId);
  }
}
