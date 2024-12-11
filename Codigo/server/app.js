import express from 'express';
import session from 'express-session';
import routes from './src/routes/routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || 'seu-segredo',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

export default app;
