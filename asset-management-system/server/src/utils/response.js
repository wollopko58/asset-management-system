function sendSuccess(res, data = null, message = "Success") {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
}

function sendCreated(res, data = null, message = "Created successfully") {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
}

function sendNoContent(res) {
  return res.status(204).send();
}

function sendError(res, message = "Internal Server Error", status = 500) {
  return res.status(status).json({
    success: false,
    message,
  });
}

function sendValidationError(res, errors) {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors,
  });
}

function sendUnauthorized(res, message = "Unauthorized") {
  return res.status(401).json({
    success: false,
    message,
  });
}

function sendForbidden(res, message = "Forbidden") {
  return res.status(403).json({
    success: false,
    message,
  });
}

module.exports = {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
};