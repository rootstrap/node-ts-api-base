/* eslint-disable camelcase */
import { SESService } from '@services/ses.service';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import { USE_AWS_SES, SENDGRID_API_KEY, SENDGRID_API_USER, USE_SENDGRID } from '@config';
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
    if (USE_AWS_SES() && USE_SENDGRID()) {
      throw new Error('Could not have more than one Email Provider enabled');
    }

    if (USE_AWS_SES()) {
      this.transporter = this.buildSesTransport();
      return;
    } else if (USE_SENDGRID()) {
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
    throw error;
  }
};
