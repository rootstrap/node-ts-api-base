/* eslint-disable camelcase */
import { SESService } from '@services/ses.service';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import { AWS_USE_SES, SENDGRID_API_KEY, SENDGRID_API_USER, SENDGRID_USE } from '@config';
import * as sgTransport from 'nodemailer-sendgrid-transport';
import aws from 'aws-sdk';
import SESTransport from 'nodemailer/lib/ses-transport';
import { EmailInterface } from '@interfaces';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class EmailClient {
  transporter: Transporter<SentMessageInfo>;
  private static instance: EmailClient;

  public static getInstance(): EmailClient {
    if (!this.instance) {
      this.instance = new EmailClient();
    }

    return this.instance;
  }

  constructor() {
    if (AWS_USE_SES && SENDGRID_USE) {
      throw new Error('Could not have more than one Email Provider enabled');
    }

    if (AWS_USE_SES) {
      this.transporter = this.buildSesTransport();
      return;
    } else if (SENDGRID_USE) {
      this.transporter = this.buildSendGridTransport();
      return;
    }

    throw new Error('ClientProvider missing, please check your .env config file');
  }

  // Create AWS-SES Transporter
  private buildSesTransport(): Transporter<SESTransport.SentMessageInfo> {
    const ses = SESService.createSES();
    return nodemailer.createTransport({
      SES: { ses, aws }
    });
  }

  // Create SendGrid Transporter
  private buildSendGridTransport(): Transporter<SMTPTransport.SentMessageInfo> {
    const credentials = {
      api_user: SENDGRID_API_USER as string,
      api_key: SENDGRID_API_KEY as string
    };

    const sendGripOptions: EmailInterface.ISendGridOptions = {
      auth: credentials
    };
    const sendGrigOptions = sgTransport(sendGripOptions);
    return nodemailer.createTransport(sgTransport(sendGrigOptions));
  }
}

export const createEmailClient = (): EmailClient => {
  try {
    return EmailClient.getInstance();
  } catch (error) {
    console.error(`EmailClient error: ${error}`);
    console.error('Please check your Email configuration.');
    process.exit(1);
  }
};
