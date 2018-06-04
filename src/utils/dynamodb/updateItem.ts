import { DynamoDB, AWSError } from 'aws-sdk';
import { Words } from 'src/types/tables';

/**
 * 更新処理
 *
 * @param params 更新パラメータ
 * @param db DBインスタンス
 */
const updateItem = (params: DynamoDB.DocumentClient.UpdateItemInput, db: DynamoDB.DocumentClient): Promise<DynamoDB.DocumentClient.UpdateItemOutput> =>
  new Promise<DynamoDB.DocumentClient.UpdateItemOutput>((
    resolve: (value?: DynamoDB.DocumentClient.UpdateItemOutput) => void,
    reject: (err?: AWSError) => void,
  ) => {
    db.query(params, (err: AWSError, data: DynamoDB.DocumentClient.UpdateItemOutput) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      resolve(data);
    });
  });

export default updateItem;
