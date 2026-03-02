import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  experiment: { type: mongoose.Schema.Types.ObjectId, ref: 'Experiment', required: true },
  startDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  renewable: { type: Boolean, default: true },
  paymentId: { type: String }, // Google Pay payment token
  transactionId: { type: String }, // Manual transaction ID for verification
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  orderId: { type: String }, // Order reference
  amount: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  merchantAccount: { type: String }, // Where payment is credited
  paymentMethod: { type: String, enum: ['googlepay', 'manual'], default: 'googlepay' }
}, {
  timestamps: true
});

const Purchase = mongoose.model('Purchase', purchaseSchema);
export default Purchase;
