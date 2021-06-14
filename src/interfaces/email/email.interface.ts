/* eslint-disable camelcase */
import { EmailPlatformConstants } from '@constants/email';
import { Transporter, SentMessageInfo } from 'nodemailer';

export interface ISendGridOptions {
  auth: IAuthSendGrid;
}

export interface IEmail {
  from: string;
  to: string;
  subject: string;
  template?: string;
  text?: string;
  context?: any;
}

export interface IAuthSendGrid {
  api_user?: string;
  api_key: string;
}

export interface IHandlebarsOptions {
  viewEngine: HandlebarsViewEngine;
  viewPath: string;
}

type HandlebarsViewEngine = {
  extname: string;
  layoutsDir: string;
  partialsDir?: string;
  defaultLayout: string;
};

export type TransporterMapper = {
  [k in EmailPlatformConstants.EmailPlatforms]: () => Transporter<SentMessageInfo>;
};
