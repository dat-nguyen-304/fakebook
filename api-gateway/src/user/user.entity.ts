import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsAlphanumeric, Length, Max, Min, MinLength } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    @IsAlphanumeric()
    username: string;

    @Column()
    @Length(3, 30)
    fullName: string;

    @Column()
    password: string;

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
