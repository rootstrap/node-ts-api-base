import * as nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';
import ejs from 'ejs';
import { SENDGRID_API_KEY, SENDGRID_EMAIL } from '@config';
import path from 'path';

export class Mailer {
  private transporter;
  static WELCOME = 'welcome';

  constructor() {
    this.transporter = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey: SENDGRID_API_KEY || ''
      })
    );
  }

  async sendMail(to: string, subject: string, template: string, data: any) {
    const file = `${path.join(
      __dirname,
      '../views/emails/',
      template
    )}.html.ejs`;

    ejs.renderFile(file, { ...data }, async (err, data) => {
      if (err) {
        return console.log(err);
      }

      const options = {
        from: SENDGRID_EMAIL,
        to,
        subject,
        html: data
      };

      await this.transporter.sendMail(options, error => {
        if (error) {
          return console.log(`Error sending email: ${error}`);
        }
        console.log(`Email has been sent to ${to}!`);
      });
    });
  }
}
