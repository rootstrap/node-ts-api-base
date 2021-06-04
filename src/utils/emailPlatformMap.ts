import { EmailPlatforms } from '@constants/emailPlatforms';
import { EmailService } from '@services/email.service';
import { Transporter } from 'nodemailer';
import SESTransport from 'nodemailer/lib/ses-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const transpoterMapper: {
  [k in EmailPlatforms]: () => Transporter<
    SMTPTransport.SentMessageInfo | SESTransport.SentMessageInfo
  >;
} = {
  SENDGRID: EmailService.buildSendGridTransport,
  SES: EmailService.buildSesTransport
};
