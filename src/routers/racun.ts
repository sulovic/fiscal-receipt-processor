import express from "express";
import racunController from "../controllers/racun.js";

const router = express.Router();

router.get("/:brojRacuna", racunController.getRacunController);

export default router;
