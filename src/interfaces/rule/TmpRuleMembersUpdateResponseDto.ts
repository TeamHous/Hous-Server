import { TmpRuleMembersUpdateDto } from './TmpRuleMembersUpdateDto';

export interface TmpRuleMembersUpdateResponseDto
  extends TmpRuleMembersUpdateDto {
  _id: string;
  ruleName: string;
}
