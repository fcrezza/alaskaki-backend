import express from "express";
/* eslint-disable-next-line */
import bodyParser from "body-parser";
import cors from "cors";
// import cookieParser from "cookie-parser";
// import morgan from "morgan";

// import user from "./components/user";
// import store from "./components/store";
// import errorMiddleware from "./shared/errorMiddleware";
const app = express();
// 3rd party middleware
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"]
  })
);
app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("holla");
});

// app middleware
// app.use("/api/v1/user", user);
// app.use("/api/v1/store", store);
// app.use(errorMiddleware);

export default app;
