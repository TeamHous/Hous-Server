import mongoose from 'mongoose';

export interface RuleCategoryResponseDto {
  _id: string;
  roomId: string;
  ruleCategoryName: string;
  ruleCategoryIcon: string;
}
