/* eslint-disable camelcase */
export interface ISendGridOptions {
  auth: IAuthSendGrid;
}

export interface IEmail {
  from: string;
  to: string;
  subject: string;
  text?: string;
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
