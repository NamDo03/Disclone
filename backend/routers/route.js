import { Router } from 'express';

const router = Router();
router.get('/hello', async (req, res) => {
  try {
    res.status(200).json({ message: "hello" });
  } catch (error) {
    return next(error);
  }
});

export { router };