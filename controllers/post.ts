import express, { Request, Response } from "express";
import connection from "../db/db";

// for sending files as form data
import multer from "multer";
import { upload } from "../multer/multer";
import cloudinary from "../cloudinary/cloudinary";

// create new post to mySQL database
export const createPost = async (
  //good
  req: Request,
  res: Response
): Promise<void> => {
  upload.single("picture")(req, res, async (err) => {
    if (err) {
      console.log(err);
    }
    // create uniqueIdentifier for the image
    const uniqueIdentifier = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // create publicId for the image for cloudinary
    const publicId = `image-${uniqueIdentifier}`;

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
      name: req.body.name,
      sub_heading: req.body.sub_heading,
      post: req.body.post,
      year: req.body.year,
      tag: req.body.tag,
      picture: result.secure_url,
    };

    // send post to mySQL database
    connection.query("INSERT INTO posts SET ?", post, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.status(200).json({ message: result });
    });
  });
};

export const getWinnersOnHomePage: express.RequestHandler = async (
  //good
  req: Request,
  res: Response
) => {
  // get 3 winners to be displayed on home page

  connection.query(
    "SELECT id, name, sub_heading, post, picture FROM posts WHERE tag='winners' LIMIT 3",
    (err, result) => {
      if (err) {
        console.log("Error fetching data");
        res
          .status(500)
          .json({ message: "Error fetching data. Try again later." });
      } else if (result.length < 1) {
        console.log("No post to display");
        res.status(404).json({ message: "No post found" });
      } else {
        res.status(200).json({ message: result });
      }
    }
  );
};

// get all posts
export const getAllPostsWithTotalCommentNumber: express.RequestHandler = async (
  // good
  req: Request,
  res: Response
) => {
  connection.query(
    // "SELECT posts.id, posts.name, posts.picture, posts.sub_heading, posts.year, posts.post, COUNT(comments.id) AS total_comments FROM posts LEFT JOIN comments ON posts.id = comments.post_id WHERE tag <> 'past hero' GROUP BY posts.id ORDER BY id DESC",
    "SELECT posts.id, posts.name, posts.picture, posts.sub_heading, posts.year, posts.post, COUNT(post_comments.id) AS total_comments FROM posts LEFT JOIN post_comments ON posts.id = post_comments.post_id WHERE tag <> 'past hero' GROUP BY posts.id ORDER BY id DESC",
    (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length < 1) {
        res.status(404).json({ error: "No post found" });
      }
      res.status(200).json({ message: result });
    }
  );
};

// search for posts by year
export const getPostsByYear: express.RequestHandler = async (
  //good
  req: Request,
  res: Response
) => {
  const year = req.query.year;
  connection.query(
    "SELECT posts.id, posts.name, posts.picture, posts.sub_heading, posts.year, posts.post, COUNT(post_comments.id) AS total_comments FROM posts LEFT JOIN post_comments ON posts.id = post_comments.post_id WHERE year = ? AND tag <> 'past hero' ORDER BY id DESC",
    [year],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error fetching data. Try again later." });
      } else if (result.length < 1) {
        res.status(404).json({ error: "No post found" });
      } else {
        res.status(200).json({ message: result });
      }
    }
  );
};

// get single post by id and associated comments
export const getPostByIdWithComments: express.RequestHandler = async (
  //no comments returned for now
  req: Request,
  res: Response
) => {
  // Get post ID from the params
  const post_id = Number(req.query.post_id);
  console.log(post_id);
  console.log(typeof post_id);

  // Check if post ID is received
  if (!post_id) {
    return res.status(400).json({ error: "Missing post id" });
  }

  // Check if the post exists and avoid race condition
  const postExists = await new Promise<boolean>((resolve) => {
    connection.query(
      "SELECT * FROM posts WHERE id = ?",
      [post_id],
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

  // If the post doesn't exist, return a 404 error
  if (!postExists) {
    return res.status(404).json({ error: "Post not found" });
  }

  // Get the post and the associated comments
  connection.query(
    "SELECT p.id, p.name, p.sub_heading, p.post, p.year, p.picture, COUNT(c.id) AS total_comments FROM posts p JOIN post_comments c ON p.id = c.post_id WHERE p.id = ?",
    [post_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "Failed to fetch post and comments from database" });
      } else if (result.length < 1) {
        return res.status(404).json({ error: "No comments found" });
      } else {
        res.status(200).json(result);
      }
    }
  );
};

// get posts where tag equal to past heros. Sort by A-C, D-G, H-I, J-Z
export const getPostsByTagPastHeros: express.RequestHandler = async (
  //good
  req: Request,
  res: Response
) => {
  connection.query(
    "SELECT * FROM posts WHERE tag='past hero'",
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch posts from database" });
      } else if (result.length < 1) {
        res.status(404).json({ error: "No posts found with tag: past hero" });
      } else {
        res.status(200).json({ message: result });
      }
    }
  );
};

// get all posts and join them with associated comments from mySQL database
// export const getAllPostsAndComments = async (req: Request, res: Response) => {
//   connection.query(
//     "SELECT posts.id, posts.picture, posts.sub_heading, posts.year, posts.post, GROUP_CONCAT(comments.statement) AS comments FROM posts LEFT JOIN comments ON posts.id = comments.post_id GROUP BY posts.id",
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       }
//       res.status(200).json({ posts: result });
//     }
//   );
// };
