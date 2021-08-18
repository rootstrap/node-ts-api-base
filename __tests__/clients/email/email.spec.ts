import { createEmailClient } from '@clients/email/email.client';

describe('Creating email client ', () => {
  it('check if it is throwing an error with missing transporter', () => {
    process.env.USE_AWS_SES = 'false';
    process.env.USE_SENDGRID = 'false';

    expect(() => createEmailClient()).toThrowError(Error);
  });

  it('check if it is throwing an error if both Transporter were configured', () => {
    process.env.USE_AWS_SES = 'true';
    process.env.USE_SENDGRID = 'true';

    expect(() => createEmailClient()).toThrowError(Error);
  });

  it('check if it is created succesfully only for SES', () => {
    process.env.USE_AWS_SES = 'true';
    process.env.USE_SENDGRID = 'false';

    expect(() => createEmailClient()).not.toThrow();
  });

  it('check if it is created succesfully only for SENDGRID', () => {
    process.env.USE_AWS_SES = 'false';
    process.env.USE_SENDGRID = 'true';

    expect(() => createEmailClient()).not.toThrow();
  });
});
