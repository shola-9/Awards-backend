import express, { Request, Response } from "express";
import connection from "../../db/db";

export const getClubMembers: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const club_id = Number(req.query.club_id);

  if (!club_id) {
    res.status(400).json({ error: "Missing club id" });
  }

  try {
    connection.query(
      "SELECT club_members.*, users.username FROM club_members JOIN users ON club_members.user_id = users.user_id",
      [club_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failed to fetch club from database" });
        } else if (result.length < 1) {
          res.status(200).json({ message: "Club members not found" });
        } else {
          res.status(200).json({ clubMembers: result });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
