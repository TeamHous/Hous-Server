import { PostBaseResponseDto } from '../../common/response/PostBaseResponseDto';

export interface EventResponseDto extends PostBaseResponseDto {
  eventName: string;
  eventIcon: string;
  date: string;
  participants: UserType[];
}

export interface UserType extends PostBaseResponseDto {
  userName: string;
  typeColor: string;
  isChecked: boolean;
}
export interface UserTypeWithDate extends UserType {
  typeUpdatedDate: Date;
}
