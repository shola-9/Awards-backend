import express, { Request, Response } from "express";
import connection from "../../db/db";

export const postCommentToPost: express.RequestHandler = async (
  //good
  req: Request,
  res: Response
) => {
  // get the club_post_id from the query
  const club_post_id = Number(req.query.club_post_id);
  const { club_post_comment } = req.body;

  connection.query(
    "INSERT INTO club_post_comments (club_post_id, club_post_comment) VALUES(?, ?)",
    [club_post_id, club_post_comment],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error fetching data. Try again later." });
      } else {
        res.status(200).json({ result });
      }
    }
  );
};
