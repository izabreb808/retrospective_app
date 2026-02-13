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
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  activeTeamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  name: String,
});

const User = mongoose.model("User", userSchema);

const teamSchema = new mongoose.Schema({
  name: String,
  code: { type: String, unique: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Team = mongoose.model("Team", teamSchema);

const cardSchema = new mongoose.Schema({
  id: String,
  text: String,
  votes: { type: Number, default: 0 },
});

const columnSchema = new mongoose.Schema({
  id: String,
  title: String,
  cards: [cardSchema],
});

const retroSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  name: String,
  date: String,
  status: { type: String, enum: ["open", "closed"], default: "open" },
  columns: [columnSchema],
});

const Retro = mongoose.model("Retro", retroSchema);

const teamMemberSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  name: String,
  role: String,
  avatar: String,
});

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);


const auth = (req: any, res: any, next: any) => {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ error: "Brak tokena" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Nieprawidłowy token" });
  }
};

const generateTeamCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};


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

// Pobierz dane użytkownika
app.get("/user", auth, async (req: any, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ error: "Użytkownik nie znaleziony" });
  res.json({ username: user.email });
});

// Twórz zespół
app.post("/team/create", auth, async (req: any, res) => {
  const { name } = req.body;
  const code = generateTeamCode();
  const team = await Team.create({ name, code, ownerId: req.userId });
  await User.findByIdAndUpdate(req.userId, { 
    $push: { teams: team._id },
    activeTeamId: team._id 
  });
  res.json(team);
});

// Dołącz do zespołu
app.post("/team/join", auth, async (req: any, res) => {
  const { code } = req.body;
  const team = await Team.findOne({ code: code.toUpperCase() });
  if (!team) return res.status(404).json({ error: "Nie znaleziono zespołu" });
  await User.findByIdAndUpdate(req.userId, { 
    $addToSet: { teams: team._id },
    activeTeamId: team._id 
  });
  res.json(team);
});

// Lista zespołów użytkownika
app.get("/teams", auth, async (req: any, res) => {
  const user = await User.findById(req.userId).populate("teams");
  res.json(user?.teams || []);
});

// Zmień aktywny zespół
app.post("/team/switch", auth, async (req: any, res) => {
  const { teamId } = req.body;
  await User.findByIdAndUpdate(req.userId, { activeTeamId: teamId });
  res.json({ success: true });
});

// Pobierz aktywny zespół
app.get("/team/active", auth, async (req: any, res) => {
  const user = await User.findById(req.userId).populate("activeTeamId");
  if (!user?.activeTeamId) return res.status(404).json({ error: "Brak zespołu" });
  res.json(user.activeTeamId);
});

// Lista retrospektyw
app.get("/retros", auth, async (req: any, res) => {
  const user = await User.findById(req.userId);
  if (!user?.activeTeamId) return res.json([]);
  const retros = await Retro.find({ teamId: user.activeTeamId }).sort({ date: -1 });
  res.json(retros);
});

// Tworzenie nowej retrospektywy
app.post("/retros", auth, async (req: any, res) => {
  const user = await User.findById(req.userId);
  if (!user?.activeTeamId) return res.status(400).json({ error: "Brak zespołu" });
  const { name, date } = req.body;
  const retro = await Retro.create({
    teamId: user.activeTeamId,
    name,
    date,
    columns: [
      { id: "good", title: "Poszło dobrze", cards: [] },
      { id: "bad", title: "Problemy", cards: [] },
      { id: "improve", title: "Do poprawy", cards: [] },
      { id: "actions", title: "Działania do podjęcia", cards: [] },
    ],
  });
  res.json(retro);
});

// Pobieranie konkretnej retrospektywy
app.get("/retros/:id", auth, async (req: any, res) => {
  const user = await User.findById(req.userId);
  const retro = await Retro.findOne({ _id: req.params.id, teamId: user?.activeTeamId });
  if (!retro) return res.status(404).json({ error: "Nie znaleziono" });
  res.json(retro);
});

// Aktualizacja retrospektywy
app.put("/retros/:id", auth, async (req: any, res) => {
  const user = await User.findById(req.userId);
  const { columns, name, status } = req.body;
  const update: any = {};
  if (columns) update.columns = columns;
  if (name) update.name = name;
  if (status) update.status = status;

  const retro = await Retro.findOneAndUpdate(
    { _id: req.params.id, teamId: user?.activeTeamId },
    update,
    { new: true }
  );
  if (!retro) return res.status(404).json({ error: "Nie znaleziono" });
  res.json(retro);
});

// Usuwanie retrospektywy
app.delete("/retros/:id", auth, async (req: any, res) => {
  const user = await User.findById(req.userId);
  const retro = await Retro.findOneAndDelete({ _id: req.params.id, teamId: user?.activeTeamId });
  if (!retro) return res.status(404).json({ error: "Nie znaleziono" });
  res.json({ success: true });
});

// TYMCZASOWY - Aktualizacja tytułów kolumn
app.post("/retros/fix-titles", auth, async (req: any, res) => {
  const result = await Retro.updateMany(
    {},
    [{
      $set: {
        columns: {
          $map: {
            input: "$columns",
            as: "col",
            in: {
              $mergeObjects: [
                "$$col",
                {
                  title: {
                    $switch: {
                      branches: [
                        { case: { $eq: ["$$col.id", "good"] }, then: "Poszło dobrze" },
                        { case: { $eq: ["$$col.id", "bad"] }, then: "Problemy" },
                        { case: { $eq: ["$$col.id", "improve"] }, then: "Do poprawy" },
                        { case: { $eq: ["$$col.id", "actions"] }, then: "Działania do podjęcia" }
                      ],
                      default: "$$col.title"
                    }
                  }
                }
              ]
            }
          }
        }
      }
    }]
  );
  res.json({ message: "Zaktualizowano", modified: result.modifiedCount });
});

// Zespół
app.get("/team", auth, async (req: any, res) => {
  const user = await User.findById(req.userId);
  if (!user?.activeTeamId) return res.json([]);
  const members = await TeamMember.find({ teamId: user.activeTeamId });
  res.json(members);
});

app.post("/team", auth, async (req: any, res) => {
  const user = await User.findById(req.userId);
  if (!user?.activeTeamId) return res.status(400).json({ error: "Brak zespołu" });
  const { name, role, avatar } = req.body;
  const member = await TeamMember.create({ teamId: user.activeTeamId, name, role, avatar });
  res.json(member);
});

app.delete("/team/:id", auth, async (req: any, res) => {
  const user = await User.findById(req.userId);
  await TeamMember.findOneAndDelete({ _id: req.params.id, teamId: user?.activeTeamId });
  res.json({ success: true });
});

// ------------------------
// URUCHOMIENIE SERWERA
// ------------------------
app.listen(port, () => console.log(`Backend działa na http://localhost:${port}`));
