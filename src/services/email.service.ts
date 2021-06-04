import * as sgTransport from 'nodemailer-sendgrid-transport';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { Service } from 'typedi';
import { AuthSg, ISgOptions, IEmail } from '@interfaces/email.interface';
import { transpoterMapper } from '@utils/emailPlatformMap';
import { SENDGRID_API_KEY, SENDGRID_API_USER } from '@config';
import { SESService } from '@services/ses.service';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import SESTransport from 'nodemailer/lib/ses-transport';

@Service()
export class EmailService {
  private static getSgOptions(sgCredentials: AuthSg): ISgOptions {
    return {
      auth: sgCredentials
    };
  }

  static buildSendGridTransport(): Transporter<SMTPTransport.SentMessageInfo> {
    const credentials = {
      api_user: SENDGRID_API_USER,
      api_key: SENDGRID_API_KEY as string
    };
    const options = sgTransport(this.getSgOptions(credentials));
    return nodemailer.createTransport(sgTransport(options));
  }

  static buildSesTransport(): Transporter<SESTransport.SentMessageInfo> {
    const sesService = new SESService();
    const ses = sesService.createSES();
    return nodemailer.createTransport({
      SES: { ses, aws }
    });
  }

  sendEmail(email: IEmail, emailPlatform: string) {
    const transporter = transpoterMapper[emailPlatform];
    return new Promise((resolve, reject) => {
      transporter.sendMail(email, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }
}
