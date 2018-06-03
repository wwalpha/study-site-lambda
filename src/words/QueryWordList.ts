import { DynamoDB } from 'aws-sdk';

const params = (userId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: 'Words',
  IndexName: 'lsiIdx1',
  KeyConditionExpression: '#userId = :userId AND #nextTime = :nextTime',
  ExpressionAttributeNames: {
    '#userId': 'UserId',
    '#nextTime': 'NextTime',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':nextTime': nextTime,
  },
  Limit: 49,
  Select: 'ALL_ATTRIBUTES',
  ReturnConsumedCapacity: 'TOTAL',
});

export default params;
