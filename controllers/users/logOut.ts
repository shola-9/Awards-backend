import express, { Request, Response } from "express";
import connection from "../../db/db";
export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token", {
    path: "/",
  });

  res.status(200).json({ msg: "Logged Out Successfully" });

  // Redirect to the home page
  res.redirect("/");
};
