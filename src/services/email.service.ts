import { SentMessageInfo, Transporter } from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import { Service } from 'typedi';
import { EmailInterface } from '@interfaces';
import { HandlebarsConstants } from '@constants/email';
import { ErrorsMessages } from '@constants/errorMessages';
import { EmailClient } from 'src/bootstrap/email.client';

@Service()
export class EmailService {
  private transporter: Transporter<SentMessageInfo> | undefined;

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
      const emailClient = EmailClient.getInstance();
      emailClient.transporter?.use('compile', hbs(this.getHbsOptions));
      const emailSent = await emailClient.transporter?.sendMail(email);
      return emailSent;
    } catch (error) {
      throw new Error(`${ErrorsMessages.EMAIL_NOT_SENT}: ${error}`);
    }
  }
}
