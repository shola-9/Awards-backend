import express, { Request, Response } from "express";
import connection from "../../db/db";

export const getAncestriesPostById: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ancestries_postid = Number(req.query.ancestries_postid);

  if (!ancestries_postid) {
    res.status(400).json({ error: "Missing ancestries_postid" });
    return;
  }
  try {
    connection.query(
      `
      SELECT 
    ap.ancestries_postid, 
    ap.post_heading, 
    ap.post_sub_heading, 
    TIMESTAMPDIFF(YEAR, ap.age, CURDATE()) AS age, 
    ap.sex, 
    ap.email,
    ap.address, 
    ap.state, 
    ap.nationality, 
    ap.date_year, 
    ap.content,
    GROUP_CONCAT(api.ancestries_posts_img_url) AS img_urls,
    COALESCE(comment_count, 0) AS comment_count
FROM 
    ancestries_posts ap
LEFT JOIN 
    ancestries_posts_imgs api ON ap.ancestries_postid = api.ancestries_post_id
LEFT JOIN (
    SELECT 
        post_id, 
        COUNT(*) AS comment_count
    FROM 
        ancestries_posts_comments
    GROUP BY 
        post_id
) AS comments ON ap.ancestries_postid = comments.post_id
WHERE 
    ap.ancestries_postid = ?
GROUP BY 
    ap.ancestries_postid;
 
      `,
      [ancestries_postid],
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failed to fetch post from database" });
        } else if (result.length < 1) {
          res.status(404).json({ message: "No post yet" });
        } else {
          res.status(200).json({ ancestries_posts: result });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
