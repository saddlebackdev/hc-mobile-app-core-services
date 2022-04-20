// npx jest --watch ./src/__tests__/apiUtils.test.ts
import ApiHelper from '../apiHelper';

describe('ApiHelper', () => {
  it('a', async () => {
    const personApi = new ApiHelper({
      url: 'v2/person/search',
      params: {
        q: '*',
      },
    });

    let r = await personApi.getNextPage();
    console.log('r1', r.data);
    expect(r.data.results.length).toBe(5);

    r = await personApi.getNextPage();
    console.log('r2', r.data);

    r = await personApi.getNextPage();
    console.log('r3', r.data);

    expect(1).toBe(1);
  }, 20000);
});
