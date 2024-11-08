import { type Request, type Response, type NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  // res.status(statusCode).render("error", {
  //   stack: process.env.NODE_ENV === "production" ? null : err.message,
  //   message: err.message,
  // });
  res.status(statusCode).send({
    name: err.name,
    status: statusCode,
    path: req.originalUrl,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
    message: err.message,
  });
};

const clientErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  const statusCode = res.statusCode ? res.statusCode : 500;
  if (req.xhr) {
    res.status(statusCode).send({ error: "Client Error" });
  } else {
    next(err);
  }
};

export { errorHandler, clientErrorHandler };
