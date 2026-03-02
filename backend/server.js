import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/Authroutes.js";
import experimentRoutes from "./Routes/experimentRoutes.js";
import finalTestRoutes from "./Routes/finalTestRoutes.js";
import submissionRoutes from "./Routes/submissionRoutes.js";
import Experiment from "./models/Experiment.js";
import { authenticateJWT } from "./middleware/authmiddleware.js";

//dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Seed default sorting experiment
const seedExperiments = async () => {
  try {
    const existing = await Experiment.findOne({ type: 'sorting', title: 'Bubble & Selection Sort Lab' });
    if (!existing) {
      await Experiment.create({
        title: 'Bubble & Selection Sort Lab',
        description: 'Learn and practice Bubble Sort and Selection Sort algorithms with interactive visualizations',
        type: 'sorting',
        requiresPayment: true,
        price: 1,
        defaultDurationDays: 30
      });
      console.log('✓ Default sorting experiment created');
    }
  } catch (err) {
    console.log('Note: Could not seed experiments (DB may not be ready yet)');
  }
};
seedExperiments();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/experiments", experimentRoutes); // Public read, protected write
app.use("/api/final-test", authenticateJWT, finalTestRoutes);
app.use("/api/submissions", authenticateJWT, submissionRoutes);


// Routes
app.get("/", (req, res) => {
  res.send("SimuLab: Virtual Lab API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
