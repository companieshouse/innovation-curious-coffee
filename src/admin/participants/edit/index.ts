import express from "express";
import validation from "../../../registration/register/validation";
import { get, post } from "./edit";

const router = express.Router();

router.get("/:email", get);
router.post("/:email", validation, post);

export default router;
