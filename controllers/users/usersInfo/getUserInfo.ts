import express, { Request, Response } from "express";
import connection from "../../../db/db";
import getUserIDFromToken from "../../global/getUserIdFromToken";

export const getUserInfo: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const user_id = getUserIDFromToken(req);

  if (!user_id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    connection.query(
      "SELECT user_id, username, email, users_phone_number, user_img FROM users WHERE user_id = ?",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Internal server error" });
          return;
        } else if (result.length < 1) {
          res.status(200).json({ message: "No profile yet. Create one." });
          return;
        } else {
          res.status(200).json({ user: result[0] });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
