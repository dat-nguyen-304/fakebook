import { IsOptional, IsBooleanString, IsString, IsEnum } from 'class-validator';

export enum ImageType {
  AVATAR = 'avatar',
  COVER = 'cover'
}

export class UpdateUserImageDto {
  @IsEnum(ImageType)
  type: ImageType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBooleanString()
  isPublic: string;
}
