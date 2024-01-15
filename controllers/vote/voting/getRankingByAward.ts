import express, { Request, Response } from "express";
import connection from "../../../db/db";

export const getRankingByAward: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { award_id } = req.query;

  if (!award_id) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    connection.query(
      `
      SELECT 
      ROW_NUMBER() OVER (ORDER BY total_votes DESC) AS position,
          candidate,
          COUNT(*) AS total_votes,
          ROUND((COUNT(*) / (SELECT COUNT(*) FROM vote_awards_votes WHERE award_name_id = ?)) * 100, 1) AS percentage_of_total_votes
      FROM 
          vote_awards_votes
      WHERE award_name_id = ?
      GROUP BY 
          candidate
      ORDER BY 
          total_votes DESC; 

            `,
      [award_id, award_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Internal server error." });
          return;
        } else if (result.length < 1) {
          res.status(404).json({ error: "No candidates found." });
          return;
        }
        res.status(200).json({ candidates: result });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
