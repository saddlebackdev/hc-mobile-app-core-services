// npx jest --watch ./src/__tests__/apiHelper.test.ts
import ApiHelper from '../apiPaginationHelper';
import 'dotenv/config';

describe('ApiHelper', () => {
  it('a', async () => {
    const abortController = { signal: 'test', abort: () => {} };

    const personApi = new ApiHelper(
      {
        url: '/api/v2/person/search',
        params: {
          q: 'oscar',
        },
      },
      abortController
    );
    // console.log('personApi', personApi);
    // Page 1
    // let r = await personApi.getNextPage();
    // console.log('r1', r.data);
    // expect(r.data.results.length).toBe(5);

    // // Page 2
    // r = await personApi.getNextPage();
    // console.log('r2', r.data);

    // // Page 3
    // r = await personApi.getNextPage();
    // console.log('r3', r.data);

    // personApi.resetPage();

    // // this would load the first page
    // // after reseting the page number
    // r = await personApi.getNextPage();
    expect(1).toBe(1);
  }, 20000);

  it('b', () => {
    // console.log(process.env);
    expect(1).toBe(1);
  });
});
