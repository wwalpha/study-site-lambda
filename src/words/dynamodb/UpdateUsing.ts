import { DynamoDB } from 'aws-sdk';

const params = (userId: string, word: string): DynamoDB.DocumentClient.UpdateItemInput => ({
  TableName: 'Words',
  Key: {
    UserId: userId,
    Word: word,
  },
  UpdateExpression: 'SET IsUsing = :isUsing',
  AttributeUpdates: {
    ':isUsing': {
      Action: 'PUT',
      Value: true,
    },
  },
  ReturnConsumedCapacity: 'TOTAL',
});

export default params;
