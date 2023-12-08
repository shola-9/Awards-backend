import express, { Request, Response } from "express";
import connection from "../../db/db";
import getUserIDFromToken from "../global/getUserIdFromToken";

export const getGroupsByMemberId: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const user_id = getUserIDFromToken(req);

  if (!user_id) {
    return res.status(400).json({ error: "Missing user id" });
  }

  try {
    connection.query(
      "SELECT club_members.user_id, club_members.club_id, club.club_name, users.user_id, club.club_img FROM club_members LEFT JOIN club ON club_members.club_id = club.club_id LEFT JOIN users ON users.user_id = club_members.user_id WHERE users.user_id = ?",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failed to fetch club from database" });
        } else if (result.length < 1) {
          res.status(200).json({ message: "Groups not found" });
        } else {
          res.status(200).json({ yourGroups: result });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
