import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole, UserStatus } from '@tudongnro/shared-types';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, index: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ default: null })
  avatarUrl: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER, index: true })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ default: null, select: false })
  refreshTokenHash: string;

  @Prop({ default: null })
  lastLoginAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
