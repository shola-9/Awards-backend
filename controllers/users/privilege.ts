import express, { Request, Response } from "express";
import getUserIdFromToken from "../global/getUserIdFromToken";
import connection from "../../db/db";

export const privilegeCheck: express.RequestHandler = (
  req: Request,
  res: Response
) => {
  const user_id = getUserIdFromToken(req);

  // check the user privilege
  if (!user_id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    connection.query(
      `SELECT privilege FROM users WHERE user_id = ?`,
      [user_id],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(200).json({ privilege: result[0].privilege });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
