const mysql = require('mysql');
const AWS = require('aws-sdk');

const conn = mysql.createConnection({
  host: 'alpha.cinlbecofvo4.ap-northeast-1.rds.amazonaws.com',
  database: 'StudySite',
  user: 'wwalpha',
  password: 'session10',
});

// 接続
conn.connect();

const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-1',
  // endpoint: 'http://localhost:8000',
});

// userdataの取得
conn.query('SELECT * FROM `TIMES` WHERE USER_ID = \'Alpha\';', (err, rows, fields) => {
  if (err) { console.log('err: ' + err); }

  rows.forEach((item, idx) => {
    const param = {
      UserId: item.USER_ID,
      Times: item.TIMES,
      DayDelay: item.DAY_DELAY,
    };

    docClient.put({
      TableName: 'Times',
      Item: param,
    }, (err, data) => {
      if (err) {
        console.error(err, param);
        return;
      }
    });
  })
});

conn.end();