const AWS = require('aws-sdk');

const describeTable = (tableName, config) => new Promise((resolve, reject) => {
  const dynamoDB = new AWS.DynamoDB(config);

  dynamoDB.describeTable({
    TableName: tableName,
  }, (err, data) => {
    if (err) {
      resolve();
      return;
    }
    resolve(data);
  });
});

module.exports = describeTable;