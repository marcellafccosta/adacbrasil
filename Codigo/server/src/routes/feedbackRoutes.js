import { Router } from "express";

import { FeedbackController } from "../controllers/FeedbackController.js";

const router = Router();

const feedbackController = new FeedbackController();

router.post('/', feedbackController.addFeedback);
router.get('/', feedbackController.getAll)
router.delete('/:id', feedbackController.deleteFeedback)

export { router as FeedbackRoutes }