import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsAlpha, IsAlphanumeric, IsEnum, Length, MaxLength, MinLength } from 'class-validator';

enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    @IsAlphanumeric()
    username: string;

    @Column()
    @Length(3, 30)
    @IsAlpha()
    fullName: string;

    @Column()
    @MinLength(6)
    password: string;

    gender: number;

    @MaxLength(500)
    biography: string;

    @CreateDateColumn()
    createdDate?: Date;

    @UpdateDateColumn()
    updatedDate?: Date;
}

export class CreateUserDto {
    @IsAlphanumeric()
    @Length(4, 30)
    username: string;

    @Length(3, 30)
    fullName: string;

    @IsEnum(Gender)
    gender: Gender;

    @MinLength(3)
    password: string;
}

export class LoginDto {
    @IsAlphanumeric()
    @Length(4, 30)
    username: string;

    @MinLength(3)
    password: string;
}
