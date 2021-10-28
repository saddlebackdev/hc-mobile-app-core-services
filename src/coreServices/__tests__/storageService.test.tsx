// npx jest ./src/__tests__/storageService.test.tsx
import {setItem, getItem, removeItem} from '../storageService';

describe('StorageService', () => {
  it('setItem function should store value item in async storage', async () => {
    await setItem('username', 'testUser', 'asyncStorage');
    let usernameValue = await getItem('username', 'asyncStorage');
    expect(usernameValue).toBe('testUser');
  });

  it('removeItem function should remove value from async storage', async () => {
    await removeItem('username', 'asyncStorage');
    let usernameValue = await getItem('username', 'asyncStorage');
    expect(usernameValue).toBeUndefined();
  });
});
