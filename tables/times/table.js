const AWS = require('aws-sdk');
const createTable = require('../commons/createTable');
const deleteTable = require('../commons/deleteTable');

const config = {
  region: 'ap-northeast-1',
  // endpoint: 'http://localhost:8000',
};

const params = {
  TableName: 'Times',
  KeySchema: [
    { AttributeName: 'UserId', KeyType: 'HASH' },
    { AttributeName: 'Times', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'UserId', AttributeType: 'S' },
    { AttributeName: 'Times', AttributeType: 'N' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

const exec = async (params, config) => {
  await deleteTable(params.TableName, config);

  await createTable(params, config);
}

exec(params, config).catch(err => console.error(err));