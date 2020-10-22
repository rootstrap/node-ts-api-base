import * as aws from 'aws-sdk';
import { ReadStream } from 'fs';
import { S3_ID, S3_SECRET, S3_BUCKETNAME } from '../config';

aws.config.update({
  accessKeyId: S3_ID,
  secretAccessKey: S3_SECRET
});

type SendData = aws.S3.ManagedUpload.SendData;
const ManagedUpload = aws.S3.ManagedUpload;

const bucket = S3_BUCKETNAME || '';

/**
 * Interacting with an S3 Bucket
 */
export default class {
  /**
   * @description uploads a file to S3
   * @param {ReadStream} file - file stream
   * @param {string} name - name it will have in the AWS S3 bucket
   * @example
   * import S3 from '<path...>/s3.service'
   * // ...
   * try {
   *   let stream = fs.createReadStream(pathToFile);
   *   const data = await S3.upload(stream, 'name-of-file');
   *   // ...do something with data if success...
   * } catch (e) {
   *   // ...do something with error if failure...
   * }
   */
  static async upload(file: ReadStream, name: string): Promise<SendData> {
    const managedUpload = new ManagedUpload({
      params: {
        Bucket: bucket,
        Key: name.toString(),
        Body: file
      }
    });

    return managedUpload.promise();
  }

  /**
   * @description deletes a file from S3
   * @param {string} key - file identifier in the AWS S3 bucket
   * @example
   * import S3 from '<path...>/s3.service'
   * // ...
   * try {
   *   const data = await s3.delete(fileKey);
   *   // ...do something with data if success...
   * } catch (e) {
   *   // ...do something with error if failure...
   * }
   */
  static async delete(key: string) {
    return new Promise((resolve, reject) => {
      const s3 = new aws.S3();
      const params: aws.S3.DeleteObjectRequest = {
        Bucket: bucket,
        Key: key
      };

      s3.deleteObject(params, (error, data) => {
        if (error) {
          reject(error);
        }

        resolve(data);
      });
    });
  }
}
