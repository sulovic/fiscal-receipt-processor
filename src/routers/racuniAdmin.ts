import express from "express";
import racuniAdminController from "../controllers/racuniAdmin.js";

const router = express.Router();

router.get("/", racuniAdminController.getAllRacuniController);
router.get("/:brojRacuna", racuniAdminController.getRacunController);
router.post("/", racuniAdminController.createRacunController);
router.put("/:brojRacuna", racuniAdminController.updateRacunController);
router.delete("/:brojRacuna", racuniAdminController.deleteRacunController);

export default router;
