export interface RuleCategoryResponseDto extends RuleCategoryBaseDto {
  roomId: string;
  ruleCnt: number;
}

export interface RuleCategoryBaseDto {
  _id: string;
  ruleCategoryName: string;
  ruleCategoryIcon: string;
}
