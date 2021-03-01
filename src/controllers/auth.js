import Joi from "joi";
import validator from "validator";

import {HTTPBadRequestError} from "../utils/errors";

export function getAuthenticatedUser(request, response) {
  // response.send("this authenticated user route");
}

export function login(request, response) {
  const inputValidation = Joi.object({
    username: Joi.string().trim().required().messages({
      "string.base": "Username yang dimasukan bukan valid string",
      "string.empty": "Username tidak boleh kosong",
      "any.required": "Username tidak boleh kosong"
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

  input.username = validator.escape(input.username);
  input.password = validator.escape(input.password);

  response.json({input});
}

export function signup(request, response) {
  const inputValidation = Joi.object({
    email: Joi.string().email().trim().required().messages({
      "string.base": "Email yang dimasukan bukan valid string",
      "string.email": "Email yang dimasukan tidak valid",
      "string.empty": "Email tidak boleh kosong",
      "any.required": "Email tidak boleh kosong"
    }),
    fullname: Joi.string().trim().required().messages({
      "string.base": "Nama lengkap yang dimasukan bukan valid string",
      "string.empty": "Nama lengkap tidak boleh kosong",
      "any.required": "Nama lengkap tidak boleh kosong"
    }),
    username: Joi.string().trim().required().messages({
      "string.base": "Username yang dimasukan bukan valid string",
      "string.empty": "Username tidak boleh kosong",
      "any.required": "Username tidak boleh kosong"
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
  input.fullname = validator.escape(input.fullname);
  input.username = validator.escape(input.username);
  input.password = validator.escape(input.password);

  response.json({input});
}

export function logout(request, response) {
  response.send("this logout route");
}
