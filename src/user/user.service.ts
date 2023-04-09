import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  // initialize the "User" model by injecting with the the shape "UserInterface"
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
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
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;

    // find the user
    const existingUser = await this.userModel.findOne({ email });

    if (
      existingUser &&
      (await bcrypt.compare(password, existingUser.password))
    ) {
      // define payload
      const payload: JwtPayload = { email };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check login credentials');
    }
  }
  //   get all users
  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  // find a user by email
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }
}
