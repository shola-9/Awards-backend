import express, { Request, Response } from "express";
import connection from "../../db/db";

export const getShortVideosComments: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  // get the short videos id from the query
  const video_id = Number(req.query.video_id);
  connection.query(
    "SELECT reels_comments.*, users.username FROM reels_comments JOIN short_videos ON reels_comments.short_video_id = short_videos.short_videos_id JOIN users ON reels_comments.user_id = users.user_id WHERE short_videos.short_videos_id = ?",
    [video_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Failed to fetch comments from database" });
      } else {
        // Check if the video with the given video_id exists
        connection.query(
          "SELECT * FROM short_videos WHERE short_videos_id = ?",
          [video_id],
          (videoErr, videoResult) => {
            if (videoErr) {
              console.log(videoErr);
              res
                .status(500)
                .json({ error: "Failed to fetch video from database" });
            } else if (videoResult.length < 1) {
              res.status(404).json({ error: "Video not found" });
            } else {
              // Send the video along with comments or an empty array
              const video = videoResult[0];
              res.status(200).json({ video, comments: result || [] });
            }
          }
        );
      }
    }
  );
};
