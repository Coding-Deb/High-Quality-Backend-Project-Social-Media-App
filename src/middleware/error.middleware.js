import express from "express";

const handleError = (err, req, res, next) => {
  // Log the error for debugging purposes (consider using a logging library)
  console.error(err);

  // Determine the appropriate status code and error message based on the error type
  let statusCode = 500; // Default to internal server error
  let message = "Internal Server Error";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Invalid request data";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "AuthenticationError") {
    statusCode = 401;
    message = "Unauthorized";
  } else if (err.name === "AuthorizationError") {
    statusCode = 403;
    message = "Forbidden";
  } else if (err.name === "NotFoundError") {
    statusCode = 404;
    message = "Not Found";
  } else if (err.name === "ConflictError") {
    statusCode = 409;
    message = "Conflict";
  }

  // Send a formatted error response to the client
  res.status(statusCode).json({
    status: false,
    message,
    error: err.message, // Include additional details for debugging
  });
};

export default handleError;