import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import articleRoutes from './routes/articles';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Route artikel
app.use('/api/articles', articleRoutes);

app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
});
