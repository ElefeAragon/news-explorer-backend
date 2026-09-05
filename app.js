require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const articlesRouter = require("./routes/articles");
const auth = require("./middlewares/auth");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

const { MONGO_URI } = require("./utils/config");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

app.use(requestLogger);

app.use("/", authRouter);
app.use("/users", auth, usersRouter);
app.use("/articles", auth, articlesRouter);

app.use((req, res) => {
  res.status(404).send({ message: "Recurso no encontrado" });
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
