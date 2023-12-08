import express, { Request, Response } from "express";
import connection from "../../db/db";

export const getClubById: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const club_id = req.query.club_id;
  console.log(club_id);

  if (!club_id) {
    res.status(400).json({ error: "Missing club id" });
  }

  try {
    connection.query(
      "SELECT * FROM club WHERE club_id = ?",
      [club_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failed to fetch club from database" });
        } else if (result.length < 1) {
          // send back other available clubs
          connection.query("SELECT * FROM club", (err: Error, result: []) => {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({ error: "Failed to fetch club from database" });
            } else if (result.length < 1) {
              return res.status(404).json({ error: "Club not found" });
            } else {
              res.status(200).json({
                message:
                  "The club with id " + club_id + " was not found. Try these.",
                clubs: result,
              });
            }
          });
        } else {
          res.status(200).json({ club: result[0] });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
