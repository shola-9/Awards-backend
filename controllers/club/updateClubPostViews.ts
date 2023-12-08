import express, { Request, Response } from "express";
import connection from "../../db/db";

export const increaseClubPostViews: express.RequestHandler = async (
  //good
  req: Request,
  res: Response
) => {
  // get the club_post_id from the query
  const club_post_id = Number(req.query.club_post_id);
  connection.query(
    "UPDATE club_posts SET club_post_views = COALESCE(club_post_views, 0) + 1 WHERE club_post_id = ?",
    [club_post_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error fetching data. Try again later." });
      } else if (result.length < 1) {
        res.status(404).json({ error: "No post found" });
      } else {
        res.status(200).json({ reels: result });
      }
    }
  );
};
