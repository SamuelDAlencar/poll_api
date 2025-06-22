import { Router } from "express";

export default (router: Router): void => {
  router.post("/signup", async (req, res) => {
    res.status(201).json({ message: "User signed up successfully" });
  });
};
