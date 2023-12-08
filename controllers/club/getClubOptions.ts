import express, { Request, Response } from "express";
import connection from "../../db/db";

export const getClubOptions: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // send back club_id, club_name, club_img. From other tables. Total members, total posts for the last 24 hours.
    connection.query(
      "SELECT c.club_id, c.club_name, c.club_img, COUNT(cm.user_id) AS members_count, COUNT(cp.club_post_id) AS posts_last_24h_count FROM  club c LEFT JOIN  club_members cm ON c.club_id = cm.club_id LEFT JOIN club_posts cp ON c.club_id = cp.club_id AND cp.club_post_created_at >= NOW() - INTERVAL 1 DAY WHERE  LENGTH(c.club_img) > 10 GROUP BY  c.club_id, c.club_name, c.club_img ORDER BY RAND() LIMIT 4",
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failed to fetch clubs from database" });
        } else {
          res.status(200).json({ clubs: result });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch clubs from database" });
  }
};
