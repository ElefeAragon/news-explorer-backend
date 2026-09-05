const { NODE_ENV, JWT_SECRET, MONGO_URI } = process.env;

module.exports = {
  JWT_SECRET: NODE_ENV === "production" ? JWT_SECRET : "dev-secret-key",
  MONGO_URI:
    NODE_ENV === "production"
      ? MONGO_URI
      : "mongodb://127.0.0.1:27017/newsexplorerdb",
};