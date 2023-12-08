import express, { Request, Response } from "express";
import connection from "../../db/db";
import { UploadApiResponse } from "cloudinary";

// for sending files as form data
import multer from "multer";
import { upload } from "../../multer/multerVideo";
import cloudinary from "../../cloudinary/cloudinary";

// create new post to mySQL database
export const createShortVideo = async (
  //good
  req: Request,
  res: Response
): Promise<void> => {
  upload.single("video")(req, res, async (err) => {
    if (err) {
      console.log(err);
    }
    // create uniqueIdentifier for the image
    const uniqueIdentifier = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // create publicId for the image for cloudinary
    const publicId = `shortVideo-${uniqueIdentifier}`;

    // handle if no req.file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // upload to cloudinary
    const result = (await cloudinary.uploader
      .upload(req.file.path, {
        public_id: publicId,
        resource_type: "video",
      })
      .catch((err) => {
        console.log(err);
      })) as UploadApiResponse;

    // create post object
    const post = {
      video: result.secure_url,
      detail: req.body.detail,
      creator: req.body.creator,
      comments: req.body.comments,
      likes: req.body.likes,
      views: req.body.views,
    };

    // send post to mySQL database
    connection.query("INSERT INTO short_videos SET ?", post, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.status(200).json({ message: result });
    });
  });
};
