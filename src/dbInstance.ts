import { DynamoDB } from 'aws-sdk';

const dbConfig: DynamoDB.ClientConfiguration = {
  region: 'ap-northeast-1',
  endpoint: 'http://172.16.80.208:8000',
};

const dynamoDB = new DynamoDB.DocumentClient(dbConfig);

export default dynamoDB;
