export interface ISendGridOptions {
  auth: AuthSendGrid;
}
export interface IEmail {
  from: string;
  to: string;
  subject: string;
  template?: string;
  text?: string;
  context?: any;
}
export interface AuthSendGrid {
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
