import { DynamoDB, Endpoint } from 'aws-sdk';
import { Context, Callback, APIGatewayEvent } from 'aws-lambda';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Words } from 'src/types/tables';
import { query, updateItem } from '../utils/dynamodb';
import db from '../dbInstance';
import queryNew from './dynamodb/QueryNew';
import queryReview from './dynamodb/QueryReview';
import updateUsing from './dynamodb/UpdateUsing';

// 更新処理
const update = (userId: string, word: string, db: DynamoDB.DocumentClient) => updateItem(updateUsing(userId, word), db);

/** パラメータチェック */
const validate = (event: APIGatewayEvent, callback: Callback): boolean => {
  // no query string
  if (!event.queryStringParameters || !event.queryStringParameters.mode) {
    callback(null, {
      statusCode: 400,
      body: 'mode is must.',
    });

    return false;
  }

  const mode: string = event.queryStringParameters.mode[0];

  // only 1 or 2
  if (!('1' === mode || '2' === mode)) {
    callback(null, {
      statusCode: 400,
      body: 'mode only 1 or 2',
    });
    return false;
  }

  return true;
};

/**
 * 新規単語を取得する
 *
 * @param userId ユーザID
 * @param now 期限
 */
const getWordList = async (params: DynamoDB.DocumentClient.QueryInput): Promise<Words[]> => {
  const words: Words[] = await query(params, db);

  // 学習中を絞り込み
  const isUsing: Words[] = words.filter(item => item.IsUsing);

  // 学習中０件の場合
  if (isUsing.length !== 0) {
    return isUsing;
  }

  // 学習中の状態に更新する、最大49件
  const result: Words[] = words.length > 49 ? words.slice(0, 49) : words;

  // 同時実行タスク
  const updates: Promise<DynamoDB.DocumentClient.UpdateItemOutput>[] = result.map(item => update(item.UserId, item.Word, db));
  // 同時実行
  await Promise.all(updates);

  return result;
};

exports.handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {

  // パラメータチェック
  if (!validate(event, callback)) {
    return;
  }

  const pathParameters = event.pathParameters;
  const userId: string = _.get(pathParameters, 'userId', '');
  const mode: string = _.get(event.queryStringParameters, 'mode', [''])[0];
  const now: string = moment().format('YYYYMMDD');

  const params: DynamoDB.DocumentClient.QueryInput = mode === '1' ? queryNew(userId, now) : queryReview(userId, now);

  try {
    const result = await getWordList(params);

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
