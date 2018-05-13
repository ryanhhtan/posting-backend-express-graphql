import { xor, parseConnectionQueryParams } from './helpers';
import base64 from 'base-64';

describe('test parseConnectionQueryParams', () => {
  test('first, no cursor, no order', () => {
    const params = {
      first: 10,
    };
    const res = parseConnectionQueryParams(params);
    expect(res).toEqual({
      condition: {},
      count: 10,
      order: '_id',
      cursorKey: '_id',
    });
  });

  test('first, cursor, no order', () => {
    const params = {
      first: 10,
      after: base64.encode('_id: 123456'),
    };
    const res = parseConnectionQueryParams(params);
    expect(res).toEqual({
      condition: {
        _id: { $gt: '123456'},
      },
      count: 10,
      order: '_id',
      cursorKey: '_id',
    });
  });

  test('first, cursor, order', () => {
    const now = new Date();
    const params = {
      first: 10,
      after: base64.encode(`updated_at: ${ now.toISOString() }`),
      order: 'updated_at',
    };
    const res = parseConnectionQueryParams(params);
    expect(res).toEqual({
      condition: {
        updated_at: { $gt: now },
      },
      count: 10,
      order: 'updated_at',
      cursorKey: 'updated_at',
    });
  });

  describe('test xor', () => {
    test('true xor true should be false', () => {
      expect(xor(true, true)).toBeFalsy();
    });

    test('true xor false should be true', () => {
      expect(xor(true, false)).toBeTruthy();
    });

    test('false xor true should be true', () => {
      expect(xor(false, true)).toBeTruthy();
    });

    test('fasle xor false should be false', () => {
      expect(xor(false, false)).toBeFalsy();
    });
  });
});
