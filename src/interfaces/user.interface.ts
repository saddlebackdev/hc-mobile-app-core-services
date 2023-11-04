export interface IUser {
  preferredService?: string | null;
  profilePictureUrl?: string | null;
  profilePhotoUrl?: string | null;
  churchEntityKnown?: boolean | null;
  churchEntityId?: number | null;
  churchEntityName?: string | null;
  prefix?: string | null;
  middleName?: string | null;
  suffix?: string | null;
  nickName?: string | null;
  fullName?: string | null;
  gender?: string | null;
  maritalStatusId?: number | null;
  maritalStatus?: string | null;
  membershipStatusId?: number | null;
  membershipStatus?: string | null;
  disengagementReason?: string | null;
  birthDate?: string | null;
  deceasedDate?: string | null;
  age?: number | null;
  allergies?: string | null;
  gradeLevel?: string | null;
  departmentId?: number | null;
  departmentName?: string | null;
  departmentChurchEntityId?: number | null;
  departmentChurchEntityName?: string | null;
  preferredServiceEventId?: number | null;
  modifiedDate?: number | null;
  isAdult?: boolean | null;
  isChild?: boolean | null;
  isStudent?: boolean | null;
  milestones?: Array<any> | null;
  addresses?: Array<any> | null;
  emails?: Array<any> | null;
  phones?: Array<any> | null;
  occupations?: Array<any> | null;
  contactPreferences?: Object | null;
  emergencyContacts?: Array<any> | null;
  id: number | null;
  firstName: string | null;
  lastName: string | null;
}