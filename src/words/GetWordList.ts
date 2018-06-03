import { DynamoDB, Endpoint } from 'aws-sdk';
import { Context, Callback, APIGatewayEvent } from 'aws-lambda';
import * as moment from 'moment';
import * as _ from 'lodash';
import query from '../utils/dynamodb/query';
import db from '../dbInstance';
import queryParam from './QueryWordList';

exports.handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const pathParameters = event.pathParameters;
  const userId: string = _.get(pathParameters, 'userId', '');
  const today: string = moment().format('YYYYMMDD');
  // 検索条件
  const params: DynamoDB.DocumentClient.QueryInput = queryParam(userId, today);

  // データ検索処理
  const words = await query(params, db);

  callback(null, {
    statusCode: 500,
    body: words,
  });
};
