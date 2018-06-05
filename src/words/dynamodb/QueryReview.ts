import { DynamoDB } from 'aws-sdk';

const params = (userId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: 'Words',
  IndexName: 'lsiIdx1',
  KeyConditionExpression: '#userId = :userId AND #nextTime <= :nextTime',
  ExpressionAttributeNames: {
    '#userId': 'UserId',
    '#nextTime': 'NextTime',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':nextTime': nextTime,
    ':times_0': 0,
  },
  ScanIndexForward: false,
  FilterExpression: 'Times <> :times_0',
  Select: 'ALL_ATTRIBUTES',
  ReturnConsumedCapacity: 'TOTAL',
});

export default params;
