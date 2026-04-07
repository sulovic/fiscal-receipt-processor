import express from "express";
import bulkPullRacunController from "../controllers/bulkPullRacun.js";

const router = express.Router();

router.get("/", bulkPullRacunController.bulkPullRacunController);

export default router;
