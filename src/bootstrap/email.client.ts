import { SESService } from '@services/ses.service';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import { SENDGRID_API_KEY, SENDGRID_API_USER } from '@config';
import * as sgTransport from 'nodemailer-sendgrid-transport';
import aws from 'aws-sdk';
import SESTransport from 'nodemailer/lib/ses-transport';
import { EmailInterface } from '@interfaces';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';

export class EmailClient {
  private useSES = process.env.AWS_USE_SES;
  private useSGRID = process.env.SENDGRID_USE_SENDGRID;

  transporter?: Transporter<SentMessageInfo>;
  private static instance: EmailClient;

  constructor() {
    if (this.useSES && this.useSGRID) {
      throw new Error('Could not have more than one Email Provider enabled');
    }

    if (this.useSES) {
      this.transporter = this.buildSesTransport();
    } else if (this.useSGRID) {
      this.transporter = this.buildSendGridTransport();
    }

    throw new Error('Client Provider missing, check your config');
  }

  public static sendMail = async (params: Mail.Options) => {
    const emailClient = await EmailClient.getInstance();
    await emailClient.transporter?.sendMail(params);
  }

  public static getInstance(): EmailClient {
    if (!this.instance) {
      this.instance = new EmailClient();
    }

    return this.instance;
  }

  // Create Aws-SES Transporter
  private buildSesTransport(): Transporter<SESTransport.SentMessageInfo> {
    const ses = SESService.createSES();
    return nodemailer.createTransport({
      SES: { ses, aws }
    });
  }

  private buildSendGridTransport(): Transporter<SMTPTransport.SentMessageInfo> {
    const credentials = {
      // eslint-disable-next-line camelcase
      api_user: SENDGRID_API_USER as string,
      // eslint-disable-next-line camelcase
      api_key: SENDGRID_API_KEY as string
    };

    const sendGripOptions: EmailInterface.ISendGridOptions = {
      auth: credentials
    };
    const sendGrigOptions = sgTransport(sendGripOptions);
    return nodemailer.createTransport(sgTransport(sendGrigOptions));
  }
}
