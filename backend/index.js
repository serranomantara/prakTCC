import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/route.js";
import db from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 8080; // GCP biasanya menggunakan 8080

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: [
    'https://fe-003-dot-e-01-453413.as.r.appspot.com',
    'http://localhost:3000', // untuk development lokal
    process.env.FRONTEND_URL // dari environment variable
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Ubah struktur folder

// Health check endpoint untuk GCP
app.get('/_ah/health', (req, res) => {
  res.status(200).send('OK');
});

// Gunakan router API
app.use('/api', router); // Lebih baik gunakan prefix '/api'

// Default route - pastikan file ada di deployment
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database connection
(async () => {
  try {
    await db.authenticate();
    await db.sync(); // Tambahkan sync jika menggunakan Sequelize
    console.log("Database connected and synced");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
