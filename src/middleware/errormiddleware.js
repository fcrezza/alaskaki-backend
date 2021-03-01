import {
  HTTPBadRequestError,
  HTTPForbiddenError,
  HTTPNotFoundError,
  HTTPUnauthorizedError
} from "../utils/errors";

function errorMiddleware(error, request, response, next) {
  switch (error.constructor) {
    case HTTPNotFoundError:
    case HTTPBadRequestError:
    case HTTPForbiddenError:
    case HTTPUnauthorizedError: {
      response.status(error.code).json({
        error: {
          status: error.status,
          code: error.code,
          message: error.message
        }
      });
      break;
    }

    default:
      next(error);
  }
}

export default errorMiddleware;
