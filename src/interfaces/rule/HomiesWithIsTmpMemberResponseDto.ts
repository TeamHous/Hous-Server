export interface HomiesWithIsTmpMemberResponseDto {
  _id: string;
  ruleName: string;
  homies: HomiesWithIsTmpMember[];
}

export interface HomiesWithIsTmpMember {
  _id: string;
  userName: string;
  isTmpMember: boolean;
  typeColor: string;
}

export interface HomiesWithIsTmpMemberWithDate extends HomiesWithIsTmpMember {
  typeUpdatedDate: Date;
}
