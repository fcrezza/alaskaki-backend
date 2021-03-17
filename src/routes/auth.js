import express from "express";

import {
  localLogin,
  googleLogin,
  signup,
  logout,
  getAuthenticatedUser
} from "../controllers/auth";

const router = express.Router();

router.get("/user", getAuthenticatedUser);
router.post("/login/local", localLogin);
router.post("/login/google", googleLogin);
router.post("/signup", signup);
router.delete("/logout", logout);

export default router;
