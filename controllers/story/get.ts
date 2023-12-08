import express, { Request, Response } from "express";
import connection from "../../db/db";

export const getStory: express.RequestHandler = async (
  //good
  req: Request,
  res: Response
) => {
  connection.query(
    "SELECT story_id, story, stories.user_id, users.username, users.user_img  FROM stories LEFT JOIN users ON stories.user_id = users.user_id WHERE CHAR_LENGTH(story) > 20",
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error fetching data. Try again later." });
      } else if (result.length < 1) {
        res.status(404).json({ error: "No story found" });
      } else {
        res.status(200).json({ stories: result });
      }
    }
  );
};
