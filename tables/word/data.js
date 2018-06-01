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
  endpoint: 'http://localhost:8000',
});

// userdataの取得
conn.query('SELECT * FROM `WORDS` WHERE USER_ID = \'Alpha\';', (err, rows, fields) => {
  if (err) { console.log('err: ' + err); }

  rows.forEach((item, idx) => {
    const param = {
      UserId: item.USER_ID,
      Word: item.WORD,
      Pronounce: item.PRONOUNCE === '' ? null : item.PRONOUNCE,
      Vocabulary: item.VOCABULARY === '' ? null : item.VOCABULARY,
      NextTime: item.NEXT_TIME,
      StudyTime: item.STUDY_TIME,
      Times: item.TIMES,
      Favorite: item.FAVORITE,
      Sound: item.SOUND,
    };

    docClient.put({
      TableName: 'Words',
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