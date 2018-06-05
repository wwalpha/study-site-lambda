import { DynamoDB, Endpoint } from 'aws-sdk';
import { Context, Callback, APIGatewayEvent } from 'aws-lambda';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Words, Times } from 'src/types/tables';
import { query, updateItem } from '../utils/dynamodb';
import UpdateStudied from './dynamodb/UpdateStudied';
import QueryNextTime from './dynamodb/QueryNextTime';
import db from '../dbInstance';

// 更新処理
const update = (word: Words, db: DynamoDB.DocumentClient) => updateItem(UpdateStudied(word), db);

exports.handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const pathParameters = event.pathParameters;
  const userId: string = _.get(pathParameters, 'userId', '');
  const word: string = _.get(pathParameters, 'word', '');

  // 現在日時
  const today: string = moment().format('YYYYMMDD');
  const item: Words = event.body && JSON.parse(event.body);

  console.log(item);

  // 次の状態を更新する
  // 学習回数
  item.Times = item.Times + 1;
  // 学習日
  item.StudyTime = today;
  // 学習中 -> 終了
  item.IsUsing = false;

  const result: Times[] = await query(QueryNextTime(userId, item.Times), db);

  console.log(result);

  if (result.length === 0) {
    item.NextTime = '99999999';
  } else {
    item.NextTime = moment().add(result[0].DayDelay, 'days').format('YYYYMMDD');
  }

  // 更新処理
  const updResult = await updateItem(UpdateStudied(item), db);
  console.log('Update OK', updResult);

  callback(null, {
    statusCode: 200,
    body: 'Update Ok',
  });
};
