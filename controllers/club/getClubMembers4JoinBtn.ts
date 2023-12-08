import express, { Request, Response } from "express";
import connection from "../../db/db";
import getUserIDFromToken from "../global/getUserIdFromToken";

export const getClubMember4JoinBtn: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user_id = getUserIDFromToken(req);
  const club_id = Number(req.query.club_id);

  if (!user_id && !club_id) {
    res.status(400).json({ error: "Missing club id" });
  }

  try {
    connection.query(
      "SELECT * FROM club_members WHERE user_id = ? AND club_id = ?",
      [user_id, club_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failed to fetch club from database" });
        } else if (result.length < 1) {
          res.status(200).json({ message: "Club members not found" });
        } else {
          res.status(200).json({ clubMember: result });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
