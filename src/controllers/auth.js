import Joi from "joi";
import bcrypt from "bcrypt";
import validator from "validator";
import {OAuth2Client} from "google-auth-library";
import {v2 as cloudinary} from "cloudinary";
import path from "path";

import {
  HTTPBadRequestError,
  HTTPForbiddenError,
  HTTPNotFoundError
} from "../utils/errors";
import {getUser, insertUser} from "../services/user";
import User from "../model/user";

export async function getAuthenticatedUser(request, response) {
  const {user} = request.session;

  if (!user) {
    return response.json(null);
  }

  const userData = await getUser({_id: user.id});

  if (userData.password) {
    delete userData.password;
  }

  const avatar = await cloudinary.api.resource(userData.avatar);
  userData.avatar = avatar.secure_url;

  request.session.regenerate(() => {
    request.session.user = {
      id: userData._id
    };

    response.json({userData});
  });
}

export async function localLogin(request, response) {
  const inputValidation = Joi.object({
    email: Joi.string().email().trim().required().messages({
      "string.base": "Email yang dimasukan bukan valid string",
      "string.email": "Email yang dimasukan tidak valid",
      "string.empty": "Email tidak boleh kosong",
      "any.required": "Email tidak boleh kosong"
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.base": "Password yang dimasukan bukan valid string",
      "string.min": "Password minimal mengandung 8 karakter",
      "string.empty": "Password tidak boleh kosong",
      "any.required": "Password tidak boleh kosong"
    })
  });

  const {error, value: input} = inputValidation.validate(request.body);

  if (error) {
    throw new HTTPBadRequestError(error.details[0].message);
  }

  input.email = validator.escape(input.email);
  input.password = validator.escape(input.password);
  const user = await getUser({email: input.email});

  if (!user) {
    throw new HTTPNotFoundError(
      `Tidak ditemukan user dengan email ${input.email}`
    );
  }

  if (user.type === "Google") {
    throw new HTTPForbiddenError("Akun ini login menggunakan akun google anda");
  }

  const matchPassword = await bcrypt.compare(input.password, user.password);

  if (!matchPassword) {
    throw new HTTPForbiddenError("Kombinasi password dan email tidak cocok");
  }

  request.session.user = {
    id: user._id
  };

  const avatar = await cloudinary.api.resource(user.avatar);
  user.avatar = avatar.secure_url;
  delete user.password;

  response.json(user);
}

export async function googleLogin(request, response) {
  if (!request.body.token) {
    throw new HTTPBadRequestError("Token tidak ditemukan");
  }

  const client = new OAuth2Client(process.env.CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: request.body.token,
    audience: process.env.GOOGLE_OAUTH_CLIENT_ID
  });

  const {name, email} = ticket.getPayload();

  let user = await getUser({email: email});

  if (user && user.type !== "Google") {
    throw new HTTPForbiddenError(
      "Akun dengan email ini terhubung menggunakan login password"
    );
  }

  if (user) {
    request.session.user = {
      id: user._id
    };
    const avatar = await cloudinary.api.resource(user.avatar);
    user.avatar = avatar.secure_url;
    return response.json(user);
  }

  const avatar = await cloudinary.uploader.upload(
    // eslint-disable-next-line
    path.join(__dirname, "../assets/default.png"),
    {
      folder: "alaskaki/users",
      resource_type: "image"
    }
  );
  const newUser = new User({
    name,
    email,
    type: "Google",
    avatar: avatar.public_id
  });
  await insertUser(newUser);
  user = await getUser(newUser);
  user.avatar = avatar.secure_url;
  request.session.user = {
    id: user._id
  };
  response.json(user);
}

export async function signup(request, response) {
  const inputValidation = Joi.object({
    email: Joi.string().email().trim().required().messages({
      "string.base": "Email yang dimasukan bukan valid string",
      "string.email": "Email yang dimasukan tidak valid",
      "string.empty": "Email tidak boleh kosong",
      "any.required": "Email tidak boleh kosong"
    }),
    name: Joi.string().trim().required().messages({
      "string.base": "Nama lengkap yang dimasukan bukan valid string",
      "string.empty": "Nama lengkap tidak boleh kosong",
      "any.required": "Nama lengkap tidak boleh kosong"
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.base": "Password yang dimasukan bukan valid string",
      "string.min": "Password minimal mengandung 8 karakter",
      "string.empty": "Password tidak boleh kosong",
      "any.required": "Password tidak boleh kosong"
    })
  });

  const {error, value: input} = inputValidation.validate(request.body);

  if (error) {
    throw new HTTPBadRequestError(error.details[0].message);
  }

  input.email = validator.escape(input.email);
  input.name = validator.escape(input.name);
  input.password = validator.escape(input.password);

  let user = await getUser({email: input.email});

  if (user) {
    throw new HTTPForbiddenError("Email ini sudah digunakan oleh akun lain");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const avatar = await cloudinary.uploader.upload(
    // eslint-disable-next-line
    path.join(__dirname, "../assets/default.png"),
    {
      folder: "alaskaki/users",
      resource_type: "image"
    }
  );

  const newUser = new User({
    email: input.email,
    name: input.name,
    password: hashedPassword,
    type: "Local",
    avatar: avatar.public_id
  });

  await insertUser(newUser);
  user = await getUser(newUser);
  user.avatar = avatar.secure_url;
  request.session.user = {
    id: user._id
  };
  delete user.password;
  response.json(user);
}

export function logout(request, response) {
  request.session.destroy();
  response.clearCookie("session", {path: "/"});
  response.send("Sukses logout");
}
