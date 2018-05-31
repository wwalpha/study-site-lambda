// CREATE TABLE`WORDS`(
//   `USER_ID` varchar(50) NOT NULL,
//   `WORD_NO` int(11) NOT NULL,
//   `CATEGORY` varchar(100) DEFAULT NULL,
//   `WORD` varchar(50) NOT NULL,
//   `PRONOUNCE` varchar(50) DEFAULT NULL,
//   `VOCABULARY` varchar(50) DEFAULT NULL,
//   `NEXT_TIME` char(8) NOT NULL DEFAULT '00000000',
//   `STUDY_TIME` char(11) NOT NULL DEFAULT '00000000',
//   `TIMES` int(11) NOT NULL DEFAULT '0',
//   `FAVORITE` char(1) NOT NULL DEFAULT '0',
//   `SOUND` varchar(500) DEFAULT NULL,
//   PRIMARY KEY(`USER_ID`, `WORD_NO`)
// ) ENGINE = InnoDB DEFAULT CHARSET = utf8

const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-northeast-1',
  endpoint: 'http://localhost:8000',
});

const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: 'Words',
  KeySchema: [
    { AttributeName: 'wordId', KeyType: 'HASH' },
    { AttributeName: 'studyTime', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'wordId', AttributeType: 'N' },
    { AttributeName: 'studyTime', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
  }
});
