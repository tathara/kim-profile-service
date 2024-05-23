import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { Roles } from '../../enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    type: String,
    description: "Users's profile full name",
    example: 'Stepanenko Ryan Gosling',
  })
  @IsString({ message: 'Name must be a string' })
  public readonly name: string;

  @ApiProperty({
    type: String,
    description: "Users's profile email",
    example: 'ryan.gosling@gmail.com',
  })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email format is invaild' })
  public readonly email?: string;

  @ApiProperty({
    type: String,
    description: "Users's profile password",
    example: 'Gosling2007',
  })
  @IsString({ message: 'Password must be a string' })
  @Length(8, 20, { message: 'Password must have length from 8 to 20 letters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain only english letters, numbers and punctuation marks',
  })
  public readonly password?: string;

  @ApiProperty({
    enum: Roles,
    description: "Users's profile array of roles",
    example: [Roles.TEACHER, Roles.TESTER],
  })
  public readonly roles: Roles[];
}

export class UpdateProfileDto {
  @ApiProperty({
    type: Number,
    description: "Users's profile ID",
    example: 1337,
  })
  public readonly id: number;

  @ApiProperty({
    type: String,
    description: "Users's profile full name",
    example: 'Stepanenko Ryan Gosling',
  })
  public readonly name: string;

  @ApiProperty({
    type: String,
    description: "Users's profile email",
    example: 'ryan.gosling@gmail.com',
  })
  public readonly email: string;

  @ApiProperty({
    type: String,
    description: "Users's profile password",
    example: 'Gosling2007',
  })
  public readonly password: string;

  @ApiProperty({
    enum: Roles,
    description: "Users's profile array of roles",
    example: [Roles.TEACHER, Roles.TESTER],
  })
  public readonly roles: Roles[];
}

export class ProfileResponseProps {
  @ApiProperty({
    type: Number,
    description: "Users's profile ID",
    example: 1337,
  })
  public readonly id: number;

  @ApiProperty({
    type: String,
    description: "Users's profile password",
    example: 'Gosling2007',
  })
  public readonly password: string;

  @ApiProperty({
    type: String,
    description: "Password hashing algorithm",
    example: 'bcrypt',
  })
  public readonly alg: string;

  @ApiProperty({
    enum: Roles,
    description: "Users's profile array of roles",
    example: [Roles.TEACHER, Roles.TESTER],
  })
  public readonly roles: Roles[];
}