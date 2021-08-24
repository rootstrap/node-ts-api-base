import { SentMessageInfo, Transporter } from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import { Service } from 'typedi';
import { EmailInterface } from '@interfaces';
import { HandlebarsConstants } from '@constants/email';
import { ErrorsMessages } from '@constants/errorMessages';
import { emailClient } from '@server';

@Service()
export class EmailService {
  private static transporter: Transporter<SentMessageInfo>;
  private static instance: EmailService;


  public static getInstance(): EmailService {
    if (!this.instance) {
      this.instance = new EmailService();
      this.transporter = emailClient.transporter;
    }

    return this.instance;
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

  static async sendEmail(email: EmailInterface.IEmail) {
    try {
      this.transporter.use('compile', hbs(this.getHbsOptions));
      const emailSent = await this.transporter.sendMail(email);
      return emailSent;
    } catch (error) {
      throw new Error(`${ErrorsMessages.EMAIL_NOT_SENT}: ${error}`);
    }
  }
}
