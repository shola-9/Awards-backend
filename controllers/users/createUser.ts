import express, { Request, Response } from "express";
import connection from "../../db/db";
import bcrypt from "bcrypt";
import { jwtGenerateToken } from "../../middleware/jwt";

export const createUser: express.RequestHandler = (
  req: Request,
  res: Response
) => {
  const {
    username,
    email,
    password,
    users_phone_number,
  }: {
    username: string;
    email: string;
    password: string;
    users_phone_number: string;
  } = req.body;

  if (!username || !email || !password || !users_phone_number) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // check if the user exists and avoid race condition
  const userExists = new Promise<boolean>((resolve) => {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: err.sqlMessage });
        } else {
          resolve(result.length > 0);
        }
      }
    );
  });

  // send error if user exists
  userExists.then((exists) => {
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password using bcrypt
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err: Error | undefined, salt: string) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err });
      }

      bcrypt.hash(
        password,
        salt,
        function (err: Error | undefined, hash: string) {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: err });
          }

          // insert user into database
          connection.query(
            "INSERT INTO users (username, email, password, users_phone_number) VALUES (?, ?, ?, ?)",
            [username, email, hash, users_phone_number],
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).json({ error: "Internal server error" });
              } else {
                const user_id = result.insertId;
                const token = jwtGenerateToken(user_id);

                console.log(result.insertId);

                // const userExactId = result[0].user_id;

                res.cookie("token", token, {
                  httpOnly: true,
                  sameSite: "lax",
                  secure: true,
                  expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                });

                // remove cookie from body res. res.cookie is enough
                res.status(200).json({
                  message: "User created successfully",
                  token,
                });
              }
            }
          );
        }
      );
    });
  });
};
