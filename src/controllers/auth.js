import Joi from "joi";
import bcrypt from "bcrypt";
import validator from "validator";

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
  delete userData.password;
  response.json({userData});
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

  delete user.password;

  response.json(user);
}

export function googleLogin(request, response) {}

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
    }),
    address: Joi.string().trim().required().messages({
      "string.base": "Alamat yang dimasukan bukan valid string",
      "string.empty": "Alamat tidak boleh kosong",
      "any.required": "Alamat tidak boleh kosong"
    }),
    gender: Joi.string().valid("Male", "Female", "Other").required().messages({
      "any.only": "Jenis kelamin tidak valid",
      "string.empty": "Jenis kelamin tidak boleh kosong",
      "any.required": "Jenis kelamin tidak boleh kosong"
    })
  });

  const {error, value: input} = inputValidation.validate(request.body);

  if (error) {
    throw new HTTPBadRequestError(error.details[0].message);
  }

  input.email = validator.escape(input.email);
  input.name = validator.escape(input.name);
  input.password = validator.escape(input.password);
  input.address = validator.escape(input.address);

  let user = await getUser({email: input.email});

  if (user) {
    throw new HTTPForbiddenError("Email ini sudah digunakan oleh akun lain");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const newUser = new User({
    email: input.email,
    name: input.name,
    password: hashedPassword,
    address: input.address,
    gender: input.gender,
    type: "Local"
  });

  const insertedUser = await insertUser(newUser);

  request.session.user = {
    id: insertedUser.insertedId
  };

  user = {
    id: insertedUser.insertedId,
    ...insertedUser.ops[0]
  };

  delete user.password;
  response.json(user);
}

export function logout(request, response) {
  request.session.destroy();
  response.clearCookie("session", {path: "/"});
  response.end();
}
