import { DynamoDB } from 'aws-sdk';
import { Words } from 'src/types/tables';

const params = (params: Words): DynamoDB.DocumentClient.UpdateItemInput => ({
  TableName: 'Words',
  Key: {
    UserId: params.UserId,
    Word: params.Word,
  },
  UpdateExpression: 'SET IsUsing = :isUsing, NextTime = :nextTime, StudyTime = :studyTime, Times = :times',
  ExpressionAttributeValues: {
    ':isUsing': false,
    ':nextTime': params.NextTime,
    ':studyTime': params.StudyTime,
    ':times': params.Times,
  },
  ReturnValues: 'UPDATED_NEW',
  ReturnConsumedCapacity: 'TOTAL',
});

export default params;
