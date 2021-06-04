import { EmailService } from '@services/email.service';

export const transpoterMapper = {
  'SENDGRID': EmailService.buildSendGridTransport,
  'SES': EmailService.buildSesTransport
};
