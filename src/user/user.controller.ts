import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  // initialize and inject the service module using constructor
  constructor(private userService: UserService) {}

  // create user
  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() response) {
    try {
      // await createUserDto.validate();
      const result = await this.userService.createUser(createUserDto);
      response.status(HttpStatus.CREATED).json({ message: 'Success', result });
    } catch (err) {
      console.log(err);
      if (err instanceof ConflictException) {
        response.status(HttpStatus.CONFLICT).json({ message: err.message });
      } else {
        response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal Error', err });
      }
    }
  }

  // get all users
  @Get()
  async getUsers(@Res() response) {
    try {
      const users = await this.userService.getUsers();
      return response.status(HttpStatus.OK).json({
        users,
      });
    } catch (err) {
      response.json({ message: 'Internal Error', err });
    }
  }
}
