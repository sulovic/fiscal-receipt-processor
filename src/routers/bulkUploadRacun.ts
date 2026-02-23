import express from "express";
import bulkUploadRacunController from "../controllers/bulkUploadRacun.js";

const router = express.Router();

router.post("/", bulkUploadRacunController.bulkUploadRacunController);

export default router;
