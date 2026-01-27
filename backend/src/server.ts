import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config(); // wczytuje zmienne z .env

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI!;
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ------------------------
// POŁĄCZENIE Z BAZĄ
// ------------------------
mongoose.connect(mongoUri)
  .then(() => console.log("✅ Połączono z MongoDB Atlas"))
  .catch(err => console.error("❌ Błąd połączenia:", err));

// ------------------------
// SCHEMAT UŻYTKOWNIKA
// ------------------------
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// ------------------------
// ENDPOINTY
// ------------------------

// Rejestracja użytkownika
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email i hasło są wymagane" });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: "Użytkownik już istnieje" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hashedPassword });
  await user.save();

  res.json({ message: "Użytkownik zarejestrowany" });
});

// Logowanie użytkownika
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email i hasło są wymagane" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Nieprawidłowy email lub hasło" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ error: "Nieprawidłowy email lub hasło" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// ------------------------
// URUCHOMIENIE SERWERA
// ------------------------
app.listen(port, () => console.log(`Backend działa na http://localhost:${port}`));
