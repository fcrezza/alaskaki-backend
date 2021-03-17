import express from "express";
import "express-async-errors";
import cors from "cors";
// import morgan from "morgan";
/* eslint-disable-next-line */
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import {v2 as cloudinary} from "cloudinary";

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
      // 7 days
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: "auto"
    },
    name: "session",
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({clientPromise: mongodbClient, dbName: "alaskaki"})
  })
);
cloudinary.config({
  cloud_name: "ds1qv6d0u",
  api_key: "157869936114419",
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// app.use(morgan("dev"));

// this is our routes
app.use(routes);

// centralized error handling
app.use(errorMiddleware);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listen at port ${port}`);
});
