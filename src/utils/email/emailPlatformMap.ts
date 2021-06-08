import { EmailPlatformConstants } from '@constants/email';
import { EmailService } from '@services/email.service';
import { Transporter, SentMessageInfo } from 'nodemailer';

export const transpoterMapper: {
  [k in EmailPlatformConstants.EmailPlatforms]: () => Transporter<SentMessageInfo>;
} = {
  SENDGRID: EmailService.buildSendGridTransport,
  SES: EmailService.buildSesTransport
};
