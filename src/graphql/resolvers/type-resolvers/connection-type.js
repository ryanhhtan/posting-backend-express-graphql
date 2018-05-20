import base64 from 'base-64';

const isTimeString = (str) => {
  // console.log(str);
  if (!isNaN(parseInt(str, 10)))
    return false;

  const time = new Date(str);
  console.log(time);
  return !isNaN(time.getTime());
};

export const parseConnectionArgs = (args) => {
  let { after, order } = args;
  let condition = {};

  if (!order || order === 'id')
    order = '_id';
  if (order === '-id')
    order = '-_id';

  let cursorField = order.charAt(0) === '-'
    ? order.slice(1).trim() : order.trim();

  if (after) {
    const cursorStr = base64.decode(after);
    // console.log(cursorStr);
    const index = cursorStr.indexOf(':');
    const key = cursorStr.slice(0, index).trim();
    const valStr = cursorStr.slice(index + 1).trim();

    const val = isTimeString(valStr) ? Date(valStr) : valStr;
    const cmp = (order.charAt(0) === '-') ? '$lt' : '$gt';
    Object.assign(condition, { [key]: {[cmp]: val}});
  }
  return { condition, order, cursorField };
};

export const makeDataConnection = (nodeType, data, cursorField, total) => {
  const edges = data.map(item => {
    let cursorFieldValue = item[cursorField];
    // console.log(cursorFieldValue);
    // console.log(isTimeString(cursorFieldValue));
    if (isTimeString(cursorFieldValue))
      cursorFieldValue = new Date(cursorFieldValue).toISOString();

    return {
      cursor: base64.encode(`${ cursorField }: ${ cursorFieldValue }`),
      node: nodeType(item),
    };
  });

  const pageInfo = {
    hasNextPage: data.length < total,
    endCursor: edges.length === 0 ? null : edges[data.length - 1].cursor,
  };

  return {edges, pageInfo};
};
