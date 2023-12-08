import express, { Request, Response } from "express";
import connection from "../../db/db";

export const updateVideoViewsCount: express.RequestHandler = async (
  //good
  req: Request,
  res: Response
) => {
  // get the id from the query
  const video_id = Number(req.query.video_id);
  console.log(video_id);

  connection.query(
    "UPDATE short_videos SET views = COALESCE(views, 0) + 1 WHERE short_videos_id = ?",
    [video_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error fetching data. Try again later." });
      } else if (result.length < 1) {
        res.status(404).json({ error: "No video found" });
      } else {
        res.status(200).json({ views: result });
      }
    }
  );
};
