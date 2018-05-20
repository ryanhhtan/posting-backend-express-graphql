import { issueToken, verifyToken } from './index';

const testData = {
  id: 123456,
};

let savedResult = {
  token: '',
};

describe('issue and verify token', async() => {
  test('issue token', async() => {
    const res = await issueToken(testData);
    // console.log(res);
    savedResult.token = res;
    expect(savedResult.token.length).toBeGreaterThan(0);
  });

  test('verify token', async() => {
    const {id} = await verifyToken(savedResult.token);
    expect(id).toBe(testData.id);
  });
});
