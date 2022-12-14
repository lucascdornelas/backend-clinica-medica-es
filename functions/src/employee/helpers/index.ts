import * as functions from "firebase-functions";

import { Request, Response, NextFunction } from "express";

const TOKEN_ID = "ff0f2b78-685a-11ed-9022-0242ac120002";
export const validateTokenId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let tokenId;
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Basic ")
  ) {
    functions.logger.error(
      "No ID token was passed as a Basic token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Basic <ID Token>"
    );
    res.status(401).send("Unauthorized");
    return;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Basic ")
  ) {
    functions.logger.log("Found 'Authorization' header");
    tokenId = req.headers.authorization.split("Basic ")[1];
  }

  if (tokenId === TOKEN_ID) {
    next();
  } else {
    functions.logger.error("Token ID invalid");
    res.status(401).send("Unauthorized");
    return;
  }
};
