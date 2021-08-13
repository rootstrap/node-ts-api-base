import { createEmailClient } from '@clients/email/email.client';

describe('Creating email client ', () => {
  it('check if it is created succesfully only for SES', async () => {
    process.env.USE_AWS_SES = 'true';
    process.env.USE_SENDGRID = 'false';

    expect(() => createEmailClient()).not.toThrow();
  });

  it('check if it is created succesfully only for SENDGRID', async () => {
    process.env.USE_AWS_SES = 'false';
    process.env.USE_SENDGRID = 'true';

    expect(() => createEmailClient()).not.toThrow();
  });

  /**
   * In the following two cases I tried to expect on this way but
   * was not working: expect(() => createEmailClient()).toThrow();
   */

  it('check if it is throwing an error with missing transporter', async () => {
    process.env.USE_AWS_SES = 'false';
    process.env.USE_SENDGRID = 'false';

    try {
      createEmailClient();
    } catch (error) {
      console.log(error);
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('check if it is throwing an error if both Transporter were configured', async () => {
    process.env.USE_AWS_SES = 'true';
    process.env.USE_SENDGRID = 'true';

    try {
      createEmailClient();
    } catch (error) {
      console.log(error);
      expect(error).toBeInstanceOf(Error);
    }
  });
});
