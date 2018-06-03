import { DynamoDB, AWSError } from 'aws-sdk';

/**
 * データ検索処理
 * @param params パラメータ
 * @param db DBインスタンス
 */
const query = (params: DynamoDB.DocumentClient.QueryInput, db: DynamoDB.DocumentClient): any => new Promise((resolve, reject) => {
  db.query(params, (err: AWSError, data: DynamoDB.DocumentClient.QueryOutput) => {
    // has error
    if (err) {
      console.error(params, err.stack);
      reject(err);
      return;
    }

    // has more data
    if (data.LastEvaluatedKey) {
      // next start key
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      // continue query
      return query(params, db);
    }

    // query finish
    resolve(data);
  });
});

export default query;
