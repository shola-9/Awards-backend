import express, { Request, Response } from "express";
import connection from "../../db/db";

export const searchForClub: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const searchTerm = req.query.club_name as string;

    // Check if searchTerm is provided
    if (!searchTerm) {
      return res.status(400).json({ error: "club_name parameter is required" });
    }

    const queryString = `
        SELECT club_id, club_name, club_img FROM club
        WHERE club_name LIKE ?;
      `;

    connection.query(queryString, [`%${searchTerm}%`], (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "Failed to fetch club from database" });
      } else if (result.length < 1) {
        res.status(404).json({ message: "Club not found" });
      } else {
        res.status(200).json({ clubPostsSearch: result });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
