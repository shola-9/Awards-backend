import express, { Request, Response } from "express";
import connection from "../../db/db";
import getUserIDFromToken from "../global/getUserIdFromToken";

export const createAwards: express.RequestHandler = (
  req: Request,
  res: Response
) => {
  // get user id
  const user_id = getUserIDFromToken(req);

  if (!user_id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { award_name } = req.body;

  if (!award_name) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    connection.query(
      `INSERT INTO vote_awards (user_id, award_name) VALUES (?, ?)`,
      [user_id, award_name],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Failed to create award" });
          return;
        }
        res.status(201).json({ message: "Award created successfully", result });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create award" });
  }
};
