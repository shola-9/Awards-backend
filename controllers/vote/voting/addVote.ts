import express, { Request, Response } from "express";
import connection from "../../../db/db";
import getUserIDFromToken from "../../global/getUserIdFromToken";

export const addVote: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const voter_id = getUserIDFromToken(req);

  if (!voter_id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { award_id } = req.query;

  const { candidate }: { candidate: string } = req.body;

  if (!award_id || !candidate) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    // check the db for the award id and avoid race condition
    const awardExists = await new Promise<boolean>((resolve) => {
      connection.query(
        "SELECT award_id FROM vote_awards WHERE award_id = ?",
        [award_id],
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

    // If the award doesn't exist, return a 404 error
    if (!awardExists) {
      res.status(404).json({ error: "Award not found. Vote not cast." });
      return;
    }

    // check if the voter has already voted for this award
    const voteExists = await new Promise<boolean>((resolve) => {
      connection.query(
        "SELECT * FROM vote_awards_votes WHERE voter_id = ? AND award_name_id = ?",
        [voter_id, award_id],
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

    if (voteExists) {
      // send back the candidate who they voted for
      const votedCandidate = await new Promise<string>((resolve) => {
        connection.query(
          "SELECT candidate FROM vote_awards_votes WHERE voter_id = ? AND award_name_id = ?",
          [voter_id, award_id],
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

      res.status(200).json({
        message: "You have already voted for " + votedCandidate,
      });
      return;
    }

    // Insert the new award candidate into the database
    connection.query(
      `
      INSERT INTO vote_awards_votes
      (voter_id, award_name_id, candidate)
      VALUES (?, ?, ?);
        `,
      [voter_id, award_id, candidate],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Internal server error." });
          return;
        }
        res.status(201).json({ message: "Voting successful!", result });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
