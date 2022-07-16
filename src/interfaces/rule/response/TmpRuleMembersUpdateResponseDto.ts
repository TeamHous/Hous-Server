import { TmpRuleMembersUpdateDto } from '../request/TmpRuleMembersUpdateDto';

export interface TmpRuleMembersUpdateResponseDto
  extends TmpRuleMembersUpdateDto {
  _id: string;
  ruleName: string;
}
