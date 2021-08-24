import { createEmailClient } from '@clients/email/email.client';

describe('Creating email client ', () => {
  it('check if it is throwing an error with missing transporter', () => {
    process.env.EMAIL_TRANSPORTER = undefined;
    expect(() => createEmailClient()).toThrowError(Error);
  });

  it('check if it is created succesfully only for SES', () => {
    process.env.EMAIL_TRANSPORTER = 'AWS';

    expect(() => createEmailClient()).not.toThrow();
  });

  it('check if it is created succesfully only for SENDGRID', () => {
    process.env.EMAIL_TRANSPORTER = 'SENDGRID';

    expect(() => createEmailClient()).not.toThrow();
  });
});
