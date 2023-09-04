import express from "express";
import healthRoute from "./health/index.js";

const router = express.Router();

/* GET home page. */

//like router use like this
router.use("/health", healthRoute);

export default router;
