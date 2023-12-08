import express, { Request, Response } from "express";
import connection from "../../db/db";

// for sending files as form data
import { upload } from "../../multer/multer";
import cloudinary from "../../cloudinary/cloudinary";

export const createClub: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  upload.single("club_img")(req, res, async (err) => {
    if (err) {
      console.log(err);
    }
    // create uniqueIdentifier for the image
    const uniqueIdentifier = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // create publicId for the image for cloudinary
    const publicId = `club-img-${uniqueIdentifier}`;

    // handle if no req.file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: publicId,
    });

    // create data object
    const data = {
      club_name: req.body.club_name, // varchar
      about_club: req.body.about_club, // varchar
      club_img: result.secure_url, // varchar
      club_allow_invite: req.body.club_allow_invite, // tinyint
      club_location: req.body.club_location, // varchar
      club_tag: req.body.club_tag, // enum
      club_rules_and_regulation: req.body.club_rules_and_regulation, // varchar
      club_type: req.body.club_type, // enum
    };

    // insert data into the db
    connection.query("INSERT INTO club SET ?", data, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
      }
      res.status(200).json({ message: result });
    });
  });
};
