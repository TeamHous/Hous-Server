export interface UserResponseDto extends UserBaseResponseDto {
  notificationState: boolean;
}

export interface UserBaseResponseDto {
  userName: string;
  job: string;
  introduction: string;
  hashTag: string[];
  typeName: string;
  typeColor: string;
  typeScore: number[];
}
