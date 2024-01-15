import express, { Request, Response } from "express";
import connection from "../../../db/db";

// for sending files as form data
import { upload } from "../../../multer/multer";
import cloudinary from "../../../cloudinary/cloudinary";

export const addAwardCandidates: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.log(err);
    }
    const { award_id } = req.query;
    // create uniqueIdentifier for the image
    const uniqueIdentifier = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // create publicId for the image for cloudinary
    const publicId = `candidates-${uniqueIdentifier}`;

    // handle if no req.file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: publicId,
    });

    // create post object
    const post = {
      vote_awards_candidate_names: req.body.vote_awards_candidate_names,
      image: result.secure_url,
      award_id,
    };

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
      res.status(404).json({ error: "Award not found. Candidate not added" });
      return;
    }

    // insert the post into the database
    connection.query(
      `
              INSERT INTO vote_awards_candidates
              (vote_awards_candidate_names , image, award_id)
              VALUES (?, ?, ?);
              `,
      [post.vote_awards_candidate_names, post.image, post.award_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Failed to create award candidate." });
          return;
        }
        res.status(201).json({ message: "Award created successfully", result });
      }
    );
  });
};
