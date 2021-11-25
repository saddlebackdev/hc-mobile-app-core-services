jest.mock('react-native-app-auth', () => ({
    authorize: (config) => {
        return new Promise((resolve, reject) => {
          const testValue = {
                accessTokenExpirationDate: "2021-11-28T11:09:45Z",
                refreshToken: "af869384bbb3f30084798caee52e5fd50142cef17c668c84a83cdac6fce31cdd",
                tokenType: "Bearer",
                accessToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRCNDc1Q0I5RUQ5QTAzNThFMzExRjNBMjEwOERCNERDOUJGMDQ0MTIiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJTMGRjdWUyYUExampFZk9pRUkyMDNKdndSQkkifQ.eyJuYmYiOjE2MzU1MDU3ODUsImV4cCI6MTYzODA5Nzc4NSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1kZXYuc2FkZGxlYmFjay5jb20iLCJhdWQiOlsiaHR0cHM6Ly9pZGVudGl0eS1kZXYuc2FkZGxlYmFjay5jb20vcmVzb3VyY2VzIiwiY20tYXBpIiwiaW50cm9zcGVjdC1yZXNvdXJjZSJdLCJjbGllbnRfaWQiOiJoYy1tZW1iZXItZW5nYWdlbWVudCIsInN1YiI6Ijc3Nzk5MTAiLCJhdXRoX3RpbWUiOjE2MzU1MDU3ODEsImlkcCI6ImxvY2FsIiwidXJuOnNhZGRsZWJhY2s6dXNlcl9pZCI6WyI1MzcxZmUwZC0yMjQ4LTQ4OWYtYjgzNS04NGM5MmI4ODg5ZjIiLCI1MzcxZmUwZC0yMjQ4LTQ4OWYtYjgzNS04NGM5MmI4ODg5ZjIiXSwiaWQiOiI3Nzc5OTEwIiwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIiwidXJuOnNhZGRsZWJhY2s6cGVyc29uX2xpbmsiOiJVTktOT1dOIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIiwiaGM6Y29ubmVjdGlvbi1xdWVzdGlvbi1yZWFkIiwiaGM6Y29ubmVjdGlvbi1xdWVzdGlvbi1hbnN3ZXItcmVhZCIsImhjOmNvbm5lY3Rpb24tcXVlc3Rpb24tYW5zd2VyLWNyZWF0ZSIsImhjOmludGVybmFsLXN5c3RlbXMiLCJoYzpwZW9wbGUtY3JlZGVudGlhbHMtbWFuYWdlIiwiaGM6aW50cm9zcGVjdCIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwd2QiXX0.YdjMBavxS2KQIKe_hvwX1GIGVaX0ePGcBDHL9KMKFsbYNkZQEHIlUii9LyPdxwcKshHhpjz4zBVYUk7_abhyu8TWd4gLRR_iG060jsz7qjY3s7oM18heLXpt-vwvAG6uGeBiLI_dCZQ0gGCcrRxuSEG_cNulxSY4hpj_D9a5btjwdgMHIgFDE5Y0bEvxNDa0KL9Nbu7awx4xG6w50j6frECYUsGLKs_9RQaXgLRsfbNP4ljiPYUqujey0yDIqfDqpT0XEm5mEMbE9HhIqX85GBk9SyiF54LRSuMJQsnNEXlTPnI4x1spYhY-9q00Ac_J3JUEwloROnrba5mT9n2RvA",
                tokenAdditionalParameters: {},
                idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRCNDc1Q0I5RUQ5QTAzNThFMzExRjNBMjEwOERCNERDOUJGMDQ0MTIiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJTMGRjdWUyYUExampFZk9pRUkyMDNKdndSQkkifQ.eyJuYmYiOjE2MzU1MDU3ODUsImV4cCI6MTYzNTUwNjA4NSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1kZXYuc2FkZGxlYmFjay5jb20iLCJhdWQiOiJoYy1tZW1iZXItZW5nYWdlbWVudCIsIm5vbmNlIjoiTldONEZrakdfSzRDMGxMUGd3aDRvSEdFSzVXRk13LUVZb1ZwTnV1UzNDYyIsImlhdCI6MTYzNTUwNTc4NSwiYXRfaGFzaCI6IlRqM2xfS1RRc0hfalZiMWNUVTVjclEiLCJzaWQiOiJjNjBjNzY0ZDA5MTBiMDdlYWQ3MDBmN2MxMTQ4YWExOCIsInN1YiI6Ijc3Nzk5MTAiLCJhdXRoX3RpbWUiOjE2MzU1MDU3ODEsImlkcCI6ImxvY2FsIiwiYW1yIjpbInB3ZCJdfQ.PQlSQgo5w2On63Aowf8PmmHS3lBAVaFle-mHbY_49iKyZLwGDi9HilTZ4nJgNLH_pYDTo-DIXPS6MNCw0UNDTfKqysU2a7Q7lAnaNiPNRG1McSbDMd_KupCxTjdg6hDwsRammxReTGEQxkPhQ2yFj_sOfliKsFMLhB_qSkeTyqpEgKoLPreTiCcV6isJIkfLjAABa5dkZ8XM4wDfDnWCOGCfCDQgECsOufcXNiklZtsowGRaA4wWtrHRD_ntLaiDusW74CiHS5RlXmrHd95QCbl33wdYxuUlZU805rsj0xnBIJffIPgRNs-OxSybjvjlIzWrLf16OJVHwlg_pVhDTQ",
                authorizeAdditionalParameters: {
                    "session_state": "cfI5oHggpmOzlutQAgGl3ySdnHrsIsaeuf1xyfoZg1w.755408876312e573fdd85df0820c2d93"
                }
            }
          resolve(testValue);
        });
    },
    revoke: jest.fn()
}));
  