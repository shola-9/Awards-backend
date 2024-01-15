import express, { Request, Response } from "express";
import connection from "../../db/db";
import getUserIDFromToken from "../global/getUserIdFromToken";

export const getStoryByUserId: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const user_id = getUserIDFromToken(req);
  connection.query(
    "SELECT stories.story_id, stories.story, stories.user_id FROM stories WHERE user_id = ? ORDER BY story_id DESC LIMIT 4",
    [user_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error fetching data. Try again later." });
      } else if (result.length < 1) {
        res.status(200).json({ message: "No story found. Post one now." });
      } else {
        res.status(200).json({ stories: result });
      }
    }
  );
};
