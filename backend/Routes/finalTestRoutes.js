import express from 'express';
const router = express.Router();

// Example: Get all final tests
router.get('/', (req, res) => {
  res.json({ message: 'List of final tests (not implemented)' });
});

// Example: Add a new final test
router.post('/', (req, res) => {
  res.json({ message: 'Add final test (not implemented)' });
});

export default router;
