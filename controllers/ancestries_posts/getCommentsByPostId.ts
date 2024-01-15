import express, { Request, Response } from "express";
import connection from "../../db/db";

export const getCommentsByPostId: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ancestries_postid = Number(req.query.ancestries_postid);

  if (!ancestries_postid) {
    res.status(400).json({ error: "Missing ancestries_postid" });
    return;
  }

  try {
    // check if the post exists and avoid race condition
    const postExists = await new Promise<boolean>((resolve) => {
      connection.query(
        "SELECT * FROM ancestries_posts WHERE ancestries_postid = ?",
        [ancestries_postid],
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
      res.status(404).json({ error: "Post not found" });
      return;
    }

    connection.query(
      ` 
    SELECT
        ancestries_posts_comments.comment_id,
        ancestries_posts_comments.post_id, 
        ancestries_posts_comments.user_id, 
        ancestries_posts_comments.comment, 
        users.username, 
        users.user_img
    FROM ancestries_posts_comments
    LEFT JOIN users ON users.user_id = ancestries_posts_comments.user_id
    WHERE ancestries_posts_comments.post_id = ?
    ORDER BY ancestries_posts_comments.comment_id DESC;

      `,
      [ancestries_postid],
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failed to fetch post from database" });
        } else if (result.length < 1) {
          res.status(404).json({ message: "No post yet" });
        } else {
          res.status(200).json({ ancestries_post_comments: result });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
