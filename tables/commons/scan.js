const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-1',
  endpoint: 'http://localhost:8000',
});

const scan = params => new Promise((resolve, reject) => {
  docClient.scan(params, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    if (data.LastEvaluatedKey) {
      params.LastEvaluatedKey = data.LastEvaluatedKey;
      return scan(params);
    }

    resolve(data);
  })
});

scan({
  TableName: 'Words'
}).then(ret => console.error(ret));

