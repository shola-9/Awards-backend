import express, { Request, Response } from "express";
import connection from "../../db/db";
import bcrypt from "bcrypt";
import { jwtGenerateToken } from "../../middleware/jwt";

export const loginUser: express.RequestHandler = (
  req: Request,
  res: Response
) => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Retrieve hashed password from the database based on the provided email
  connection.query(
    "SELECT email, password, user_id FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      console.log(result);

      const storedHash = result[0].password;

      // Compare the entered password with the stored hash
      bcrypt.compare(password, storedHash, function (err, passwordMatch) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (!passwordMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        // Passwords match, generate a JWT token and send it in the response
        const userId = result[0].user_id;
        const token = jwtGenerateToken(userId);

        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        });

        res.status(200).json({ message: "Login successful", token });
      });
    }
  );
};
