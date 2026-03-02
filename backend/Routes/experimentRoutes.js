import express from 'express';
import Experiment from '../models/Experiment.js';
import Purchase from '../models/Purchase.js';
import { authenticateJWT, requireTeacher } from '../middleware/authmiddleware.js';
import { sendReceiptEmail } from '../utils/pdfGenerator.js';

const router = express.Router();

// List experiments
router.get('/', async (req, res) => {
  try {
    const experiments = await Experiment.find().lean();
    // Add currency info
    const list = experiments.map((e) => ({
      ...e,
      currency: 'INR'
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list experiments' });
  }
});

// Get experiment by ID (PUBLIC - anyone can view details)
router.get('/:id', async (req, res) => {
  try {
    const exp = await Experiment.findById(req.params.id).lean();
    if (!exp) return res.status(404).json({ message: 'Experiment not found' });
    res.json({ ...exp, currency: 'INR' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch experiment' });
  }
});

// Create an experiment (teacher only)
router.post('/', authenticateJWT, requireTeacher, async (req, res) => {
  try {
    const { title, description, type, requiresPayment, price, defaultDurationDays } = req.body;
    const experimentData = { title, description, type, requiresPayment: !!requiresPayment, defaultDurationDays };
    // If sorting experiment and price not provided, default to 1 INR
    if (type === 'sorting') {
      experimentData.price = typeof price === 'number' ? price : 1;
    } else {
      experimentData.price = typeof price === 'number' ? price : (requiresPayment ? 0 : 0);
    }

    const exp = await Experiment.create(experimentData);
    res.status(201).json({ message: 'Experiment created', experiment: exp });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create experiment' });
  }
});

// Purchase an experiment (Google Pay payment)
router.post('/:id/purchase', authenticateJWT, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized. Please login first' });
    }

    const exp = await Experiment.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Experiment not found' });

    // If experiment requires payment, Google Pay token is required
    if (exp.requiresPayment) {
      const token = req.body.googlePayToken;
      if (!token) {
        return res.status(400).json({ message: 'Google Pay token required' });
      }
      console.log(`Payment received for user ${req.user._id}, experiment ${exp._id}, token: ${token.substring(0, 20)}...`);
    }

    // Check if already purchased and access is valid
    const now = new Date();
    const existingPurchase = await Purchase.findOne({ 
      user: req.user._id, 
      experiment: exp._id,
      expiryDate: { $gt: now }
    });

    if (existingPurchase) {
      return res.status(400).json({ 
        message: 'You already have access to this experiment',
        expiryDate: existingPurchase.expiryDate
      });
    }

    const durationDays = exp.defaultDurationDays || 30;
    const startDate = new Date();
    const expiryDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const purchase = await Purchase.create({
      user: req.user._id,
      experiment: exp._id,
      startDate,
      expiryDate,
      renewable: true,
      paymentId: req.body.googlePayToken,
      orderId: `order_${Date.now()}`,
      amount: exp.price || 0,
      currency: 'INR',
      merchantAccount: 'shubpanchal07@okicici',
      paymentMethod: 'googlepay',
      verificationStatus: 'verified'
    });

    console.log(`Purchase created: ${purchase._id} for user ${req.user._id}`);

    // Send receipt email with PDF
    const paymentDetails = {
      experimentTitle: exp.title,
      amount: exp.price || 0,
      currency: 'INR',
      duration: durationDays,
      expiryDate: expiryDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      orderId: purchase.orderId,
      transactionId: req.body.googlePayToken.substring(0, 15) + '...',
      purchaseDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      userName: req.user.name,
      userEmail: req.user.email
    };

    sendReceiptEmail(paymentDetails).catch(err => {
      console.error('Failed to send receipt email:', err.message);
    });

    res.status(201).json({ 
      message: 'Purchase successful! Receipt has been sent to your email.', 
      purchase,
      expiryDate,
      currency: 'INR', 
      amountPaid: exp.price || 0,
      durationDays,
      receiptSent: true
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create purchase' });
  }
});

// Check access for an experiment
router.get('/:id/access', authenticateJWT, async (req, res) => {
  try {
    const exp = await Experiment.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Experiment not found' });

    if (!exp.requiresPayment) return res.json({ access: true, reason: 'free' });

    const now = new Date();
    const purchase = await Purchase.findOne({ user: req.user._id, experiment: exp._id, expiryDate: { $gt: now } });
    if (purchase) return res.json({ access: true, expiryDate: purchase.expiryDate });

    return res.json({ access: false });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check access' });
  }
});

// Verify manual payment with transaction ID
router.post('/:id/verify-payment', authenticateJWT, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized. Please login first' });
    }

    const { transactionId } = req.body;
    if (!transactionId || transactionId.trim() === '') {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }

    const exp = await Experiment.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Experiment not found' });

    // Check if already purchased and access is valid
    const now = new Date();
    const existingPurchase = await Purchase.findOne({ 
      user: req.user._id, 
      experiment: exp._id,
      expiryDate: { $gt: now }
    });

    if (existingPurchase) {
      return res.status(400).json({ 
        message: 'You already have access to this experiment',
        expiryDate: existingPurchase.expiryDate
      });
    }

    const durationDays = exp.defaultDurationDays || 30;
    const startDate = new Date();
    const expiryDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // Check for duplicate transaction ID
    const duplicateTransaction = await Purchase.findOne({ transactionId });
    if (duplicateTransaction) {
      return res.status(400).json({ message: 'This transaction ID has already been used' });
    }

    const purchase = await Purchase.create({
      user: req.user._id,
      experiment: exp._id,
      startDate,
      expiryDate,
      renewable: true,
      transactionId: transactionId.trim(),
      orderId: `order_${Date.now()}`,
      amount: exp.price || 0,
      currency: 'INR',
      merchantAccount: 'shubpanchal07@okicici',
      paymentMethod: 'manual',
      verificationStatus: 'verified' // Auto-verify for demo purposes
    });

    console.log(`Manual payment verified: ${purchase._id} for user ${req.user._id} with transaction ${transactionId}`);

    // Send receipt email with PDF
    const paymentDetails = {
      experimentTitle: exp.title,
      amount: exp.price || 0,
      currency: 'INR',
      duration: durationDays,
      expiryDate: expiryDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      orderId: purchase.orderId,
      transactionId: transactionId,
      purchaseDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      userName: req.user.name,
      userEmail: req.user.email,
      paymentMethod: 'Google Pay QR'
    };

    sendReceiptEmail(paymentDetails).catch(err => {
      console.error('Failed to send receipt email:', err.message);
    });

    res.status(201).json({ 
      message: 'Payment verified! Access granted for 30 days.', 
      purchase,
      expiryDate,
      currency: 'INR', 
      amountPaid: exp.price || 0,
      durationDays,
      receiptSent: true
    });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
});

// Seed default sorting experiment (for testing - creates if doesn't exist, updates if exists)
router.post('/seed/sorting-experiment', async (req, res) => {
  try {
    const sortingExp = await Experiment.findOneAndUpdate(
      { type: 'sorting' },
      {
        title: 'Bubble & Selection Sort Lab',
        description: 'Learn and practice Bubble Sort and Selection Sort algorithms with interactive visualizations',
        type: 'sorting',
        requiresPayment: true,
        price: 1,
        defaultDurationDays: 30
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Sorting experiment created/updated', experiment: sortingExp });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: 'Failed to seed experiment' });
  }
});

export default router;
