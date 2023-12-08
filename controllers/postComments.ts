import express, { Request, Response } from "express";
import connection from "../db/db";
import jwt from "jsonwebtoken";

// create comment

// Middleware to check if the post exists
export const createComment: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  // get post id from the params
  const post_id = Number(req.query.post_id);

  // get the token from the request
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {
    user_id: string;
  };

  const user_id = decodedToken.user_id;

  // get the relevant data
  const { name, email, statement } = req.body;

  // check if the body contains post_id, name, email and statement
  if (!post_id || !name || !email || !statement) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // check if the post exists and avoid race condition
  const postExists = await new Promise<boolean>((resolve) => {
    connection.query(
      "SELECT * FROM posts WHERE id = ?",
      [post_id],
      (err, result) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(result.length > 0);
        }
      }
    );
  });

  if (!postExists) {
    return res.status(404).json({ error: "Post not found" });
  }

  // add the comment to the database
  const comment = {
    post_id,
    name,
    email,
    statement,
    user_id,
  };

  connection.query(
    "INSERT INTO post_comments SET ?",
    comment,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to add comment" });
      }
      res.status(200).json({ message: "Comment added successfully", result });
    }
  );
};
