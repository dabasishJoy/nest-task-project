import { ConflictException } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Status, UserDocument, UserType } from '../user.model';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user.model';

export class CreateUserDto {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @IsString()
  fname: string;
  @IsString()
  lname: string;
  @IsString()
  email: string;
  @IsString()
  phone: string;
  @IsString()
  @MinLength(6, { message: 'Password is too short' })
  @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password is too weak',
  // })
  password: string;
  userType: UserType;
  status: Status;

  async validate(): Promise<void> {
    const existingEmail = await this.userModel.findOne({ email: this.email });
    if (existingEmail) {
      console.log('ERROr');
      throw new ConflictException('Email already exists');
    }

    const existingPhone = await this.userModel.findOne({ phone: this.phone });
    if (existingPhone) {
      console.log('ERRRO');
      throw new ConflictException('Phone number already exists');
    }
  }
}
