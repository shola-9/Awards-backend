import express, { Request, Response } from "express";
import connection from "../../db/db";
import getUserIDFromToken from "../global/getUserIdFromToken";

export const addComment: express.RequestHandler = (
  req: Request,
  res: Response
) => {
  const user_id = getUserIDFromToken(req);

  if (!user_id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const post_id = Number(req.query.post_id);
  const comment = req.body.comment;

  console.log({ post_id, comment, user_id });

  if (!post_id || !comment) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  connection.query(
    `
        INSERT INTO ancestries_posts_comments (user_id, post_id, comment) VALUES (?, ?, ?)
        `,
    [user_id, post_id, comment],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to add comment" });
      } else {
        res.status(200).json({ message: "Comment added successfully", result });
      }
    }
  );
};
