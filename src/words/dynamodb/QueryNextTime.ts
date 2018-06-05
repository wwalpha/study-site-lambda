import { DynamoDB } from 'aws-sdk';

const params = (userId: string, times: number): DynamoDB.DocumentClient.QueryInput => ({
  TableName: 'Times',
  KeyConditionExpression: '#userId = :userId AND #times = :times',
  ExpressionAttributeNames: {
    '#userId': 'UserId',
    '#times': 'Times',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':times': times,
  },
  ProjectionExpression: 'DayDelay',
  ReturnConsumedCapacity: 'TOTAL',
});

export default params;
