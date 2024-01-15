import express, { Request, Response } from "express";

import connection from "../../db/db";

import getUserIDFromToken from "../global/getUserIdFromToken";

import bcrypt from "bcrypt";

async function changePassword(req: Request, res: Response): Promise<void> {
  // get the user

  const user_id = getUserIDFromToken(req);

  if (!user_id) {
    res.status(401).json({ error: "Unauthorized" });

    return;
  }

  // get the new password from the body

  const { oldPassword, newPassword } = req.body;

  // check if the password is empty

  if (!oldPassword || !newPassword) {
    res.status(400).json({ error: "All fields are required" });

    return;
  }

  // get user password from the database and compare it with the password in the body using bcrypt

  connection.query(
    "SELECT user_id, password FROM users WHERE user_id = ?",

    [user_id],

    (err, result) => {
      if (err) {
        console.log(err);

        res.status(500).json({ error: "Internal server error" });
        return;
      }

      if (result.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      console.log(result);

      const storedHash = result[0].password;

      // Compare the entered password with the stored hash

      bcrypt.compare(oldPassword, storedHash, function (err, passwordMatch) {
        if (err) {
          console.log(err);

          res.status(500).json({ error: "Internal server error" });
          return;
        }

        if (!passwordMatch) {
          res.status(401).json({ error: "Invalid email or password" });
          return;
        } else {
          // update the password in the database

          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(newPassword, salt);

          connection.query(
            "UPDATE users SET password = ? WHERE user_id = ?",

            [hashedPassword, user_id],

            (err, result) => {
              if (err) {
                console.log(err);

                res.status(500).json({ error: "Internal server error" });
                return;
              } else {
                res

                  .status(200)

                  .json({ message: "Password updated successfully", result });
              }
            }
          );
        }
      });
    }
  );
}

export default changePassword;
