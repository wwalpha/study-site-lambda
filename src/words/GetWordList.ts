import { DynamoDB, Endpoint } from 'aws-sdk';
import { Context, Callback, APIGatewayEvent } from 'aws-lambda';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Words } from 'src/types/tables';
import query from '../utils/dynamodb/query';
import updateItem from '../utils/dynamodb/updateItem';
import db from '../dbInstance';
import queryNew from './dynamodb/QueryNew';
import updateUsing from './dynamodb/UpdateUsing';

exports.handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const pathParameters = event.pathParameters;
  const userId: string = _.get(pathParameters, 'userId', '');
  const today: string = moment().format('YYYYMMDD');
  // 検索条件
  const params: DynamoDB.DocumentClient.QueryInput = queryNew(userId, today);

  // データ検索処理
  try {
    const words: Words[] = await query(params, db);
    // 学習中を絞り込み
    const isUsing: Words[] = words.filter(item => item.IsUsing);

    // 学習中０件の場合
    if (isUsing.length !== 0) {
      // response
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(isUsing),
      });
    }

    // 学習中の状態に更新する、最大49件
    const result: Words[] = words.length > 49 ? words.slice(0, 49) : words;

    // 同時実行タスク
    const updates: Promise<DynamoDB.DocumentClient.UpdateItemOutput>[] = result.map(item => updateItem(updateUsing(item.UserId, item.Word), db));
    // 同時実行
    await Promise.all(updates);

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result),
    });
  } catch (err) {
    console.log(err);

    callback(null, {
      statusCode: 500,
      body: 'Server Error',
    });
  }
};
