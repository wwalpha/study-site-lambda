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
    ':times_9999': 9999,
  },
  ScanIndexForward: false,
  FilterExpression: 'Times = :times_0 OR Times = :times_9999',
  Select: 'ALL_ATTRIBUTES',
  ReturnConsumedCapacity: 'TOTAL',
});

export default params;
