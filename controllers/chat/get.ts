import express, { Request, Response } from "express";
import connection from "../../db/db";
import getUserIDFromToken from "../global/getUserIdFromToken";

export const getChat: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const receiver_id = getUserIDFromToken(req);
  console.log({ receiver_id });

  // get the relevant data
  const { sender_id } = req.query;
  console.log({ sender_id });

  // check if the body contains post_id, name, email and statement
  if (!sender_id || !receiver_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  connection.query(
    "SELECT * FROM chat WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
    [sender_id, receiver_id, receiver_id, sender_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to add comment" });
      }
      res.status(200).json({ message: "Post sent successfully", result });
    }
  );
};
