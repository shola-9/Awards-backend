import express, { Request } from "express";
import jwt from "jsonwebtoken";

export default function getUserIDFromToken(req: Request): string {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return "";
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { user_id: string };
    return decodedToken.user_id;
  } catch (error) {
    console.log(error);
    return "";
  }
}
