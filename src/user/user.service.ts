import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user-dto';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  // initialize the "User" model by injecting with the the shape "UserInterface"
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  // services
  //   create user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPasswrod = await bcrypt.hash(password, salt);
    const user = {
      ...createUserDto,
      password: hashedPasswrod,
    };

    const newUser = new this.userModel(user);

    return newUser.save();
  }

  //   get all users
  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users;
  }
}
