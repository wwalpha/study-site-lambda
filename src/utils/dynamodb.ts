import { DynamoDB, AWSError } from 'aws-sdk';

/**
 * データ検索処理
 *
 * @param params パラメータ
 * @param db DBインスタンス
 */
export const query = (params: DynamoDB.DocumentClient.QueryInput, db: DynamoDB.DocumentClient): Promise<any[]> =>
  new Promise((
    resolve: (value?: any[]) => void,
    reject: (err?: AWSError) => void,
  ) => {
    const result: any[] = [];

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
        data.Items && data.Items.forEach(item => result.push(item));

        // next start key
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        // continue query
        db.query(params, onQuery);

        return;
      }

      // Add All
      data.Items && data.Items.forEach(item => result.push(item));

      // return query result
      resolve(result);
    };

    // query
    db.query(params, onQuery);
  });

/**
* 全件検索処理
*
* @param params パラメータ
* @param db DBインスタンス
*/
export const scan = (params: DynamoDB.DocumentClient.ScanInput, db: DynamoDB.DocumentClient): Promise<any[]> =>
  new Promise((
    resolve: (value?: any[]) => void,
    reject: (err?: AWSError) => void,
  ) => {
    const result: any[] = [];

    const onScan = (err: AWSError, data: DynamoDB.DocumentClient.ScanOutput) => {
      // console.log('ConsumedCapacity', data.ConsumedCapacity);
      if (err) {
        console.log(params, err);
        reject(err);
        return;
      }

      // has more data
      if (data.LastEvaluatedKey) {
        // 初期化
        data.Items && data.Items.forEach(item => result.push(item));

        // next start key
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        // continue scan
        db.scan(params, onScan);

        return;
      }

      // Add All
      data.Items && data.Items.forEach(item => result.push(item));

      // return scan result
      resolve(result);
    };

    // scan
    db.scan(params, onScan);
  });

/**
* 更新処理
*
* @param params 更新パラメータ
* @param db DBインスタンス
*/
export const updateItem = (params: DynamoDB.DocumentClient.UpdateItemInput, db: DynamoDB.DocumentClient): Promise<DynamoDB.DocumentClient.UpdateItemOutput> =>
  new Promise<DynamoDB.DocumentClient.UpdateItemOutput>((
    resolve: (value?: DynamoDB.DocumentClient.UpdateItemOutput) => void,
    reject: (err?: AWSError) => void,
  ) => {
    db.update(params, (err: AWSError, data: DynamoDB.DocumentClient.UpdateItemOutput) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      resolve(data);
    });
  });
