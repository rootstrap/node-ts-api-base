/* eslint-disable camelcase */
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import * as sgTransport from 'nodemailer-sendgrid-transport';
import * as hbs from 'nodemailer-express-handlebars';
import aws from 'aws-sdk';
import { Service } from 'typedi';
import { EmailInterface } from '@interfaces';
import { transporterMapper } from '@utils/email/emailPlatformMap';
import { SENDGRID_API_KEY, SENDGRID_API_USER } from '@config';
import { SESService } from '@services/ses.service';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import SESTransport from 'nodemailer/lib/ses-transport';
import { HandlebarsConstants } from '@constants/email';
import { ErrorsMessages } from '@constants/errorMessages';

@Service()
export class EmailService {
  private static getSendGridOptions(
    sgCredentials: EmailInterface.IAuthSendGrid
  ): EmailInterface.ISendGridOptions {
    return {
      auth: sgCredentials
    };
  }

  private static getHbsOptions(): EmailInterface.IHandlebarsOptions {
    const { HandlebarsConfig } = HandlebarsConstants;
    return {
      viewEngine: {
        extname: HandlebarsConfig.FILE_EXTENSION,
        layoutsDir: HandlebarsConfig.VIEWS_PATH,
        defaultLayout: HandlebarsConfig.TEMPLATE_NAME
      },
      viewPath: HandlebarsConfig.VIEWS_PATH
    };
  }

  static buildSendGridTransport(): Transporter<SMTPTransport.SentMessageInfo> {
    const credentials = {
      api_user: SENDGRID_API_USER as string,
      api_key: SENDGRID_API_KEY as string
    };
    const sendGrigOptions = sgTransport(this.getSendGridOptions(credentials));
    return nodemailer.createTransport(sgTransport(sendGrigOptions));
  }

  static buildSesTransport(): Transporter<SESTransport.SentMessageInfo> {
    const ses = SESService.createSES();
    return nodemailer.createTransport({
      SES: { ses, aws }
    });
  }

  static async sendEmail(email: EmailInterface.IEmail, emailPlatform: string) {
    try {
      const transporter: Transporter<SentMessageInfo> =
        transporterMapper[emailPlatform];
      transporter.use('compile', hbs(this.getHbsOptions));
      const emailSent = await transporter.sendMail(email);
      return emailSent;
    } catch (error) {
      throw new Error(`${ErrorsMessages.EMAIL_NOT_SENT}: ${error}`);
    }
  }
}
