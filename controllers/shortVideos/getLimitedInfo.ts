import express, { Request, Response } from "express";
import connection from "../../db/db";

export const getLimitedInfo: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  connection.query(
    "SELECT short_videos_id, video, likes, views FROM short_videos ORDER BY short_videos_id DESC",
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

export const getLimitedInfoForHome: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  connection.query(
    "SELECT short_videos_id, video, likes, views FROM short_videos ORDER BY short_videos_id DESC LIMIT 4",
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
