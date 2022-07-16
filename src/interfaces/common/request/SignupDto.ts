export interface SignupDto {
  email: string;
  password: string;
  userName: string;
  gender: string;
  birthday?: Date;
  fcmToken: string;
}
