import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// Enums
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserType {
  ADMIN = 'admin',
  USER = 'user',
}

// union document

// Schema declaration
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fname: string;

  @Prop({ required: true })
  lname: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserType, default: UserType.USER })
  userType: UserType;

  @Prop({ enum: Status, default: Status.INACTIVE })
  status: Status;
}

export const UserSchema = SchemaFactory.createForClass(User);
