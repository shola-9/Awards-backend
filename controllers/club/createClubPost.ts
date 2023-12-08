import express, { Request, Response } from "express";
import connection from "../../db/db";
import getUserIDFromToken from "../global/getUserIdFromToken";
import { upload } from "../../multer/multer";
import cloudinary from "../../cloudinary/cloudinary";

export default async function createClubPost(
  req: any,
  res: any
): Promise<void> {
  const user_id = getUserIDFromToken(req);
  if (!user_id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  console.log({ user_id });
  const club_id = Number(req.query.club_id);
  console.log({ club_id });

  upload.array("club_post_imgs", 3)(req, res, async (error) => {
    if (error) {
      // Handle multer upload error
      if (error.message === "Unexpected field") {
        return res.status(400).json({ error: "Maximum of 3 images allowed" });
      }

      return res.status(500).json({ error: error.message });
    }

    if (!req.files || req.files.length === 0) {
      // No files uploaded
      return res.status(400).json({ error: "No files uploaded" });
    }

    if (req.files.length > 3) {
      // More than 3 files uploaded
      return res.status(400).json({ error: "Maximum of 3 images allowed" });
    }

    const {
      club_post_content,
      club_post_tag,
      club_post_likes,
      club_post_views,
    } = req.body;
    const pictureUrls = Array<string>();

    // Upload each picture to Cloudinary and store the secure URLs
    for (const file of req.files) {
      const uniqueIdentifier =
        Date.now() + "-" + Math.round(Math.random() * 1e9);
      const publicId = `${user_id}_group_post_img_${uniqueIdentifier}`;

      const result = await cloudinary.uploader.upload(file.path, {
        public_id: publicId,
      });

      pictureUrls.push(result.secure_url);
    }

    connection.query("START TRANSACTION;", (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      connection.query(
        "INSERT INTO club_posts (club_id, user_id, club_post_content, club_post_tag, club_post_likes, club_post_views) VALUES (?, ?, ?, ?, ?, ?)",
        [
          club_id,
          user_id,
          club_post_content,
          club_post_tag,
          club_post_likes,
          club_post_views,
        ],
        (error, results) => {
          if (error) {
            console.error(error);
            connection.rollback(() => {
              res.status(500).json({ error: "Internal server error" });
            });
            return;
          }

          const club_post_id = results.insertId;

          // Insert image URLs into club_post_images table
          const values = pictureUrls.map((imageUrl) => [
            club_post_id,
            imageUrl,
          ]);
          connection.query(
            "INSERT INTO club_post_images (club_post_id, club_img_url) VALUES ?",
            [values],
            (error) => {
              if (error) {
                console.error(error);
                connection.rollback(() => {
                  res.status(500).json({ error: "Internal server error" });
                });
                return;
              }

              connection.commit((error) => {
                if (error) {
                  console.error(error);
                  res.status(500).json({ error: "Internal server error" });
                  return;
                }

                res.status(200).json({ message: "Post created successfully" });
              });
            }
          );
        }
      );
    });
  });
}
