import express from "express";
import "express-async-errors";
import cors from "cors";
import cookieParser from "cookie-parser";
// import config from "config";
// import morgan from "morgan";
/* eslint-disable-next-line */
import bodyParser from "body-parser";
import routes from "./routes";
import errorMiddleware from "./middleware/errormiddleware";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"]
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(morgan("dev"));

// this is our routes
app.use(routes);

// centralized error handling
app.use(errorMiddleware);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listen at port ${port}`);
});
