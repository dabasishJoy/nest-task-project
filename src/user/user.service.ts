import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
  createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);

    return newUser.save();
  }

  //   get all users
  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find();

    return users;
  }
}
