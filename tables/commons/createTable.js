const AWS = require('aws-sdk');

const createTable = (params, config) => new Promise((resolve, reject) => {
  const dynamoDB = new AWS.DynamoDB(config);

  dynamoDB.createTable(params, (err, data) => {
    if (err) {
      reject(err);
      return;
    }
    console.log('Table Created: ' + params.TableName);
    resolve(data);
  });
});

module.exports = createTable;