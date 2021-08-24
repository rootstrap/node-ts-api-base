import * as aws from 'aws-sdk';
import { Service } from 'typedi';
import { AWS_ID, AWS_SECRET, AWS_SES_API_VERSION, AWS_REGION } from '../config';

aws.config.update({
  accessKeyId: AWS_ID as string,
  secretAccessKey: AWS_SECRET as string
});

@Service()
export class SESService {
  static createSES() {
    return new aws.SES({
      apiVersion: AWS_SES_API_VERSION as string,
      region: AWS_REGION as string
    });
  }
}
