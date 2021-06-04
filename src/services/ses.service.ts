import * as aws from 'aws-sdk';
import { Service } from 'typedi';
import { AWS_ID, AWS_SECRET } from '../config';

aws.config.update({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET
});

@Service()
export class SESService {
  createSES() {
    return new aws.SES({
      apiVersion: process.env.SES_API_VERSION,
      region: process.env.AWS_REGION
    });
  }
}
