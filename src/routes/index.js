import express from "express";

import auth from "./auth";

const router = express.Router();

router.use("/api/v1/auth", auth);

export default router;
