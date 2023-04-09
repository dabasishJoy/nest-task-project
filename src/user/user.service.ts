import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
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

  // signin
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { email, password } = authCredentialsDto;

    // find the user
    const existingUser = await this.userModel.findOne({ email });
    console.log(
      '🚀 ~ file: user.service.ts:39 ~ UserService ~ signIn ~ existingUser:',
      existingUser,
    );

    if (
      existingUser &&
      (await bcrypt.compare(password, existingUser.password))
    ) {
      return 'Success';
    } else {
      throw new UnauthorizedException('Please check login credentials');
    }
  }
  //   get all users
  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users;
  }
}
