import express, { Request, Response } from "express";
import connection from "../../db/db";

export const getFullInfo: express.RequestHandler = async (
  //good
  req: Request,
  res: Response
) => {
  // get the id from the query
  const video_id = Number(req.query.video_id);

  connection.query(
    "SELECT short_videos_id, video, detail, creator, likes, views, created_at, TIMESTAMPDIFF(YEAR, created_at, NOW()) AS years_ago, TIMESTAMPDIFF(MONTH, created_at, NOW()) AS months_ago, TIMESTAMPDIFF(DAY, created_at, NOW()) AS days_ago, TIMESTAMPDIFF(HOUR, created_at, NOW()) AS hours_ago, TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS minutes_ago, TIMESTAMPDIFF(SECOND, created_at, NOW()) AS seconds_ago FROM short_videos ORDER BY short_videos_id = 3 DESC, short_videos_id",
    [video_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error fetching data. Try again later." });
      } else if (result.length < 1) {
        res.status(404).json({ error: "No Reel found" });
      } else {
        res.status(200).json({ reels: result });
      }
    }
  );
};
