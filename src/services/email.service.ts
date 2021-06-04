import * as sgTransport from 'nodemailer-sendgrid-transport';
import nodemailer from 'nodemailer';
import aws from 'aws-sdk';
import { Service } from 'typedi';
import { AuthSg, ISgOptions, IEmail } from '@interfaces/email.interface';
import { transpoterMapper } from '@utils/emailPlatformMap';
import { SENDGRID_API_KEY, SENDGRID_API_USER } from '@config';
import { SESService } from '@services/ses.service';

@Service()
export class EmailService {
  private static getSgOptions(sgCredentials: AuthSg): ISgOptions {
    return {
      auth: sgCredentials
    };
  }

  static buildSendGridTransport() {
    const credentials = {
      api_user: SENDGRID_API_USER,
      api_key: SENDGRID_API_KEY as string
    };
    return nodemailer.createTransport(
      sgTransport(this.getSgOptions(credentials))
    );
  }

  static buildSesTransport() {
    const sesService = new SESService();
    const ses = sesService.createSES();
    return nodemailer.createTransport({
      SES: { ses, aws }
    });
  }

  sendEmail(email: IEmail, emailPlatform) {
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
