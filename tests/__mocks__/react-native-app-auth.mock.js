jest.mock('react-native-app-auth', () => ({
    authorize: (config) => {
        return new Promise((resolve, reject) => {
          const testValue = {
                accessTokenExpirationDate: "2022-11-28T11:09:45Z",
                refreshToken: "daY-k29zbte5FIFgbkBMHg",
                tokenType: "Bearer",
                accessToken: "mkDEr88ICoXsDjfAS7Hesg",
                tokenAdditionalParameters: {},
                idToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEzODY4OTkxMzEsImlzcyI6ImppcmE6MTU0ODk1OTUiLCJxc2giOiI4MDYzZmY0Y2ExZTQxZGY3YmM5MGM4YWI2ZDBmNjIwN2Q0OTFjZjZkYWQ3YzY2ZWE3OTdiNDYxNGI3MTkyMmU5IiwiaWF0IjoxMzg2ODk4OTUxfQ.uKqU9dTB6gKwG6jQCuXYAiMNdfNRw98Hw_IWuA5MaMo",
            }
          resolve(testValue);
        });
    },
    revoke: jest.fn()
}));
  