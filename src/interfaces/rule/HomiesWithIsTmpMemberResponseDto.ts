import mongoose from 'mongoose';

export interface HomiesWithIsTmpMemberResponseDto {
  _id: string;
  homies: HomiesWithIsTmpMember[];
}

export interface HomiesWithIsTmpMember {
  _id: string;
  userName: string;
  isChecked: boolean;
  typeColor: string;
}

export interface HomiesWithIsTmpMemberWithDate extends HomiesWithIsTmpMember {
  typeUpdatedDate: Date;
}
