import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/route.js";
import db from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 8080; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: [
    'https://fe-003-dot-e-01-453413.as.r.appspot.com',
    'http://localhost:3000', 
    process.env.FRONTEND_URL 
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); 

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/', (req, res) => {
  res.send('Application is running');
});

app.use('/api', router);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

(async () => {
  try {
    await db.authenticate();
    await db.sync(); 
    console.log("Database connected and synced");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
