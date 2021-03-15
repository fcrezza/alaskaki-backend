import express from "express";
import "express-async-errors";
import cors from "cors";
// import config from "config";
// import morgan from "morgan";
/* eslint-disable-next-line */
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

import routes from "./routes";
import service from "./services/main";
import errorMiddleware from "./middleware/errormiddleware";

const app = express();
const mongodbClient = service.init();

app.use(cors({credentials: true, origin: ["http://localhost:3000"]}));
app.use(bodyParser.json());
app.use(
  session({
    cookie: {
      // 30 days
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: "auto"
    },
    name: "session",
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({clientPromise: mongodbClient, dbName: "alaskaki"})
  })
);
// app.use(morgan("dev"));

// this is our routes
app.use(routes);

// centralized error handling
app.use(errorMiddleware);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listen at port ${port}`);
});
