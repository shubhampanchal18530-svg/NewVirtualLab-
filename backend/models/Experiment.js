import mongoose from 'mongoose';

const experimentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String }, // e.g. 'sorting', 'linked-list'
  requiresPayment: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  defaultDurationDays: { type: Number, default: 30 }
}, {
  timestamps: true
});

const Experiment = mongoose.model('Experiment', experimentSchema);
export default Experiment;
