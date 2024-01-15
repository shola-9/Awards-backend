import express, { Request, Response } from "express";
import connection from "../../db/db";

export const getFullInfo: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  connection.query(
    `
    SELECT sv.short_videos_id, sv.video, sv.detail, sv.likes, sv.views, sv.created_at, u.username, TIMESTAMPDIFF(YEAR, sv.created_at, NOW()) AS years_ago, TIMESTAMPDIFF(MONTH, sv.created_at, NOW()) AS months_ago, TIMESTAMPDIFF(DAY, sv.created_at, NOW()) AS days_ago, TIMESTAMPDIFF(HOUR, sv.created_at, NOW()) AS hours_ago, TIMESTAMPDIFF(MINUTE, sv.created_at, NOW()) AS minutes_ago, TIMESTAMPDIFF(SECOND, sv.created_at, NOW()) AS seconds_ago,GROUP_CONCAT(rc.reels_comments_id) AS comment_ids,GROUP_CONCAT(rc.user_comment) AS comments,GROUP_CONCAT(rc.user_id) AS comment_user_ids FROM short_videos sv JOIN users u ON sv.user_id = u.user_id LEFT JOIN reels_comments rc ON sv.short_videos_id = rc.short_video_id GROUP BY sv.short_videos_id ORDER BY  sv.short_videos_id DESC

    `,
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
