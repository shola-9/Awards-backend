import express, { Request, Response } from "express";
import connection from "../../db/db";
import jwt from "jsonwebtoken";

export const createComment: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  // get post id from the params
  //   const video_id = Number(req.query.video_id);
  //   console.log({ video_id });

  //   if (!video_id) {
  //     res.status(400).json({ error: "Missing video_id" });
  //   }
  // get the token from the request
  const token = req.headers.authorization?.split(" ")[1];
  console.log({ token });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {
    user_id: string;
  };

  const user_id = decodedToken.user_id;
  console.log({ user_id });

  // get the relevant data
  const { userComment, video_id } = req.body;
  console.log({ userComment });

  if (!userComment) {
    res.status(400).json({ error: "Missing userComment" });
  }

  const user_comment = userComment;

  // check if the video exsists and avoid race condition
  const videoExists = await new Promise<boolean>((resolve) => {
    connection.query(
      "SELECT * FROM short_videos WHERE short_videos_id = ?",
      [video_id],
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

  if (!videoExists) {
    res.status(404).json({ error: "Video not found" });
  }

  connection.query(
    "INSERT INTO reels_comments (user_id, short_video_id, user_comment) VALUES (?, ?, ?)",
    [user_id, video_id, user_comment],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error fetching data. Try again later." });
      } else {
        res.status(200).json({ comment: result });
      }
    }
  );
};
