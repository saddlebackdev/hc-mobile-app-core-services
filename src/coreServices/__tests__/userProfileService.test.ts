// npx jest ./src/coreServices/__tests__/userProfileService.test.ts
import {createUserProfile, getUserProfile, updateUserProfile} from '../userProfileService';
import axios from 'axios';
import {login} from '../authService';

const userData = {
    "preferredService": null,
    "id": 7779910,
    "profilePictureUrl": null,
    "profilePhotoUrl": null,
    "churchEntityKnown": true,
    "churchEntityId": 1,
    "churchEntityName": "Lake Forest",
    "firstName": "Bittu",
    "lastName": "Rauniyar",
    "prefix": null,
    "middleName": null,
    "suffix": null,
    "nickName": null,
    "fullName": "Bittu Rauniyar",
    "gender": null,
    "maritalStatusId": null,
    "maritalStatus": null,
    "membershipStatusId": 1,
    "membershipStatus": "Non-Member",
    "disengagementReason": null,
    "birthDate": null,
    "deceasedDate": null,
    "age": null,
    "allergies": null,
    "gradeLevel": "None",
    "departmentId": null,
    "departmentName": null,
    "departmentChurchEntityId": null,
    "departmentChurchEntityName": null,
    "preferredServiceEventId": null,
    "modifiedDate": 1629964380,
    "isAdult": true,
    "isChild": false,
    "isStudent": false,
    "milestones": [
        {
            "id": 3,
            "name": "First Contact Date",
            "category": "Personal",
            "uiOrder": 3,
            "dates": [
                {
                    "id": 1082233,
                    "date": 1626739200,
                    "location": null,
                    "churchEntityId": 1,
                    "churchEntityName": "Lake Forest",
                    "document": null,
                    "files": []
                }
            ]
        },
        {
            "id": 47,
            "name": "Healthy Church Data Covenant",
            "category": "Security",
            "uiOrder": 20,
            "dates": [
                {
                    "id": 1082234,
                    "date": 1626739200,
                    "location": "Healthy Church Application Login",
                    "churchEntityId": null,
                    "churchEntityName": null,
                    "document": null,
                    "files": []
                }
            ]
        }
    ],
    "addresses": [],
    "emails": [
        {
            "email": "bittu@optimumfuturist.com",
            "isPublic": false,
            "id": 323232,
            "personId": 7779910,
            "title": null,
            "isPrimary": true,
            "isValidated": false,
            "isBadContact": false
        }
    ],
    "phones": [],
    "occupations": [],
    "contactPreferences": {
        "id": 17494,
        "personId": 7779910,
        "preferredMethod": "email",
        "doNotMail": false,
        "doNotPhone": false,
        "doNotText": false,
        "doNotEmail": false,
        "doNotContact": false
    },
    "emergencyContacts": []
}
 
jest.mock('axios');

describe('UserProfileService', () => {
  it('getUserProfile should return null if no  access token is found', async () => {
    const mock = await getUserProfile('testurl');
    expect(mock).toEqual(null);
  });

  it('getUserProfile should return user data from api', async () => {
    (axios as unknown as jest.Mock).mockResolvedValueOnce({status:200, data:userData});
    const userLogin = await login({}, 'asyncStorage');
    const mock = await getUserProfile('testurl');
    expect(axios).toHaveBeenCalled();
    expect(mock).toEqual(userData);
  });
  
  it('createUserProfile should return user data from api', async () => {
    (axios as unknown as jest.Mock).mockResolvedValueOnce({status:200, data:userData});
    const userLogin = await login({}, 'asyncStorage');
    const mock = await createUserProfile('testurl', userData);
    expect(axios).toHaveBeenCalled();
    expect(mock).toEqual(userData);
  });
});
