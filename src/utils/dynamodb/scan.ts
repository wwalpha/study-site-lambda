import { DynamoDB, AWSError } from 'aws-sdk';

/**
 * 全件検索処理
 *
 * @param params パラメータ
 * @param db DBインスタンス
 */
const scan = (params: DynamoDB.QueryInput, db: DynamoDB) => new Promise((resolve, reject) => db.query(params, (err: AWSError, data: DynamoDB.QueryOutput) => {
  // has error
  if (err) {
    console.error(err.stack);
    return;
  }

  // has more data
  if (data.LastEvaluatedKey) {
    // next start key
    params.ExclusiveStartKey = data.LastEvaluatedKey;
    // continue query
    scan(params, db);

    return;
  }

  // query finish
  resolve(data);
}));

module.exports = scan;
