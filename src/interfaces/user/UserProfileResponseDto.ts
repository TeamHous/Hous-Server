export interface UserProfileResponseDto extends UserBaseResponseDto, TypeDto {
  notificationState: boolean;
}

export interface UserBaseResponseDto {
  userName: string;
  job: string;
  introduction: string;
  hashTag: string[];
}

export interface TypeDto {
  typeName: string;
  typeColor: string;
  typeScore?: number[];
}
