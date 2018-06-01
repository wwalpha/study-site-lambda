const AWS = require('aws-sdk');
const describeTable = require('./describeTable');

const deleteTable = (tableName, config) => new Promise((resolve, reject) => {
  const dynamoDB = new AWS.DynamoDB(config);

  dynamoDB.deleteTable({
    TableName: tableName,
  }, (err, data) => {
    if (err) {
      reject(err);
      return;
    }
    console.log('Table Deleted: ' + tableName);
    resolve();
  });
});

const deleteIfNotExist = async (tableName, config) => {
  const tableInfo = await describeTable(tableName, config);

  if (tableInfo) {
    await deleteTable(tableName, config);
  }
};

module.exports = deleteIfNotExist;
