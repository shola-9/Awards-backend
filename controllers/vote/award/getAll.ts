import express, { Request, Response } from "express";
import connection from "../../../db/db";

export const getAll: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    connection.query(
      "SELECT award_id, award_name FROM vote_awards ORDER BY award_id",
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Internal server error" });
          return;
        } else if (result.length < 1) {
          res.status(404).json({ error: "No awards found" });
          return;
        }
        res.status(200).json({ allAwards: result });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
