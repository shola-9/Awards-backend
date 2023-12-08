import express, { Request, Response } from "express";
import connection from "../../db/db";
import getUserIDFromToken from "../global/getUserIdFromToken";

export const getClubPostByUserId: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user_id = getUserIDFromToken(req);

  try {
    connection.query(
      "SELECT cp.club_post_id, cp.club_post_content, cp.user_id, u.username, u.user_img, cp.club_id, cl.club_name, cl.club_img, cp.club_post_created_at, cp.club_post_likes, cp.club_post_views, cp.club_post_tag, GROUP_CONCAT(cpi.club_img_url) AS image_urls, GROUP_CONCAT(cpc.club_post_comment) AS club_post_comments FROM club_posts cp LEFT JOIN club_post_images cpi ON cp.club_post_id = cpi.club_post_id LEFT JOIN users u ON cp.user_id = u.user_id LEFT JOIN club_post_comments cpc ON cp.club_post_id = cpc.club_post_id LEFT JOIN club cl ON cp.club_id = cl.club_id WHERE u.user_id = ? GROUP BY cp.club_post_id ORDER BY cp.club_post_created_at DESC;",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failed to fetch club from database" });
        } else if (result.length < 1) {
          res
            .status(404)
            .json({ message: "You have no posts yet. Post one now" });
        } else {
          res.status(200).json({ clubPosts: result });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
