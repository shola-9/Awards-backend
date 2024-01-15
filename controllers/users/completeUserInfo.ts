import express, { Request, Response } from "express";
import connection from "../../db/db";
import { UploadApiResponse } from "cloudinary";

// for sending files as form data
import multer from "multer";
import { upload } from "../../multer/multer";
import cloudinary from "../../cloudinary/cloudinary";
import getUserIDFromToken from "../global/getUserIdFromToken";

// create new post to mySQL database
export const completeUserInfo = async (
  //good
  req: Request,
  res: Response
): Promise<void> => {
  const user_id = getUserIDFromToken(req);
  if (!user_id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  upload.single("user_img")(req, res, async (err) => {
    if (err) {
      console.log(err);
    }
    // create uniqueIdentifier for the image
    const uniqueIdentifier = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // create publicId for the image for cloudinary
    const publicId = `user_img-${uniqueIdentifier}`;

    // handle if no req.file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // upload to cloudinary
    const result = (await cloudinary.uploader
      .upload(req.file.path, {
        public_id: publicId,
      })
      .catch((err) => {
        console.log(err);
      })) as UploadApiResponse;

    // create post object
    const post = {
      users_phone_number: req.body.user_phone_number,
      user_img: result.secure_url,
    };

    if (!post) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // send post to mySQL database
    connection.query(
      "UPDATE users SET users_phone_number = ?, user_img = ? WHERE user_id = ? ",
      [post.users_phone_number, post.user_img, user_id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        res.status(200).json({ message: result });
      }
    );
  });
};
