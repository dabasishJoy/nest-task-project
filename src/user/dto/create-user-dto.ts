import { Status, UserType } from '../user.model';

export class CreateUserDto {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  password: string;
  userType: UserType;
  status: Status;
}
