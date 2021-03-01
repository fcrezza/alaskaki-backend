import express from "express";

import {login, signup, logout, getAuthenticatedUser} from "../controllers/auth";

const router = express.Router();

router.get("/user", getAuthenticatedUser);
router.post("/login", login);
router.post("/signup", signup);
router.delete("/logout", logout);

export default router;
