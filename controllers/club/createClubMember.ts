import express, { Request, Response } from "express";
import connection from "../../db/db";
import getUserIDFromToken from "../global/getUserIdFromToken";

export const createClubMember: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const user_id = getUserIDFromToken(req);
  const club_id = Number(req.query.club_id);
  console.log(club_id);

  if (!club_id && !user_id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // insert data into database
  connection.query(
    "INSERT INTO club_members SET ?",
    {
      club_id,
      user_id,
    },
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "Failed to insert data into database" });
      }
      res.status(200).json({ message: "Data inserted successfully", result });
    }
  );
};
