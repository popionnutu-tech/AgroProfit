const app = require("../src/server");

const bootstrapPromise = app.bootstrapPromise || Promise.resolve();

module.exports = async (req, res) => {
  await bootstrapPromise;
  return app(req, res);
};
