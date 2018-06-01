const describeTable = require('./describeTable');

const test = async (TableName) => {
  const ret = await describeTable(TableName, {
    region: 'ap-northeast-1',
    endpoint: 'http://localhost:8000',
  });

  console.log(ret);
}

test('Words');