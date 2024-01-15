import express, { Request, Response } from "express";
import connection from "../../../db/db";
import getUserIDFromToken from "../../global/getUserIdFromToken";

export const getAwardCandidates: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const award_id = req.query.award_id;

  if (!award_id) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const user_id = getUserIDFromToken(req);

  try {
    if (!user_id) {
      connection.query(
        "SELECT * FROM vote_awards_candidates WHERE award_id = ? ORDER BY RAND()",
        [award_id],
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
    } else {
      // check if the user has already voted
      const userHasVoted = await new Promise<boolean>((resolve) => {
        connection.query(
          "SELECT * FROM vote_awards_votes WHERE voter_id = ? AND award_name_id = ?",
          [user_id, award_id],
          (err, result) => {
            if (err) {
              console.log(err);
              resolve(false);
            } else {
              resolve(result.length > 0);
            }
          }
        );
      });

      if (userHasVoted) {
        const votedCandidate = await new Promise<string>((resolve) => {
          connection.query(
            "SELECT candidate FROM vote_awards_votes WHERE voter_id = ? AND award_name_id = ?",
            [user_id, award_id],
            (err, result) => {
              if (err) {
                console.log(err);
                resolve("");
              } else {
                console.log(result);

                resolve(result[0]?.candidate || "");
              }
            }
          );
        });
        res.status(409).json({
          message: "You have already voted for " + votedCandidate,
        });
        return;
      } else {
        connection.query(
          "SELECT * FROM vote_awards_candidates WHERE award_id = ? ORDER BY RAND()",
          [award_id],
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
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
