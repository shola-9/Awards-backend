import express, { Request, Response } from "express";
import connection from "../../db/db";
import getUserIDFromToken from "../global/getUserIdFromToken";

export const postChat: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const sender_id = getUserIDFromToken(req);

  // get the relevant data
  const { content, receiver_id } = req.body;

  // check if the body contains post_id, name, email and statement
  if (!content || !sender_id || !receiver_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // check if both sender_id and receiver_id exist in the users table and avoid race condition
  const usersExist = await new Promise<boolean>((resolve) => {
    connection.query(
      "SELECT * FROM users WHERE user_id IN (?, ?)",
      [sender_id, receiver_id],
      (err, result) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(result.length === 2); // Both sender_id and receiver_id should exist
        }
      }
    );
  });

  if (!usersExist) {
    return res.status(404).json({ error: "Sender or receiver not found" });
  }

  // add the comment to the database
  const comment = {
    content,
    sender_id,
    receiver_id,
  };

  connection.query("INSERT INTO chat SET ?", comment, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to add comment" });
    }
    res.status(200).json({ message: "Post sent successfully", result });
  });
};
