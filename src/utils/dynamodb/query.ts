import { DynamoDB, AWSError } from 'aws-sdk';
import { Words } from 'src/types/tables';

/**
 * データ検索処理
 * @param params パラメータ
 * @param db DBインスタンス
 */
const query = (params: DynamoDB.DocumentClient.QueryInput, db: DynamoDB.DocumentClient): Promise<Words[]> =>
  new Promise<Words[]>((
    resolve: (value?: Words[]) => void,
    reject: (err?: AWSError) => void,
  ) => {
    const result: Words[] = [];

    const onQuery = (err: AWSError, data: DynamoDB.DocumentClient.QueryOutput) => {
      // console.log('ConsumedCapacity', data.ConsumedCapacity);
      if (err) {
        console.log(params, err);
        reject(err);
        return;
      }

      // has more data
      if (data.LastEvaluatedKey) {
        // 初期化
        data.Items && data.Items.forEach((item: Words) => result.push(item));

        // next start key
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        // continue query
        db.query(params, onQuery);

        return;
      }

      // Add All
      data.Items && data.Items.forEach((item: Words) => result.push(item));

      // return query result
      resolve(result);
    };

    // query
    db.query(params, onQuery);
  });

export default query;
