import express, { Request, Response } from "express";
import connection from "../../db/db";

export const getStoryByStoryId: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const story_id = Number(req.query.story_id);
  connection.query(
    "SELECT story_id, story, user_id FROM stories ORDER BY story_id = ? DESC, story_id",
    [story_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error fetching data. Try again later." });
      } else if (result.length < 1) {
        res.status(404).json({ error: "No story found. Post one now." });
      } else {
        res.status(200).json({ stories: result });
      }
    }
  );
};
