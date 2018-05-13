import base64 from 'base-64';

export const xor = (a, b) => (a || b) && !(a && b);

export const parseConnectionQueryParams = (params) => {
  let { first, after, order } = params;
  let condition = {};
  let cmp = '$gt';

  if (!first)
    first = 5;

  if (!order || order === 'id')
    order = '_id';

  let cursorKey = order;
  if (cursorKey.charAt(0) === '-') {
    cursorKey = cursorKey.slice(1);
    cmp = '$lt';
  }

  // console.log(after);
  if (after) {
    const str = base64.decode(after);
    // console.log(str);
    // const arr = str.split(':');
    const index = str.indexOf(':');
    const keyStr = str.slice(0, index);
    const valStr = str.slice(index + 1).trim();
    let val = new Date(valStr);
    
    /*
     *           |  Time| number
     *    -------|------|-------
     *   number  |   t  |   t 
     *   time    |   t  |   f
     *   nothing |   f  |   t 
     *   string  |   f  |   f
     *
     */

    if (!xor(isNaN(valStr), isNaN(val.getTime())))
      val = valStr;

    // console.log(val);
    condition[keyStr] = { [cmp]: val };
  }

  return {
    condition,
    count: first,
    order,
    cursorKey,
  };
};
