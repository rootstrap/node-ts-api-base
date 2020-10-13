// This fixes async issues in slower systems
jest.setTimeout(30000);

process.on('unhandledRejection', err => {
  fail(err);
});
