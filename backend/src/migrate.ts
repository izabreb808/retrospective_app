import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI!;

mongoose.connect(mongoUri).then(async () => {
  console.log("Połączono z MongoDB");
  
  const db = mongoose.connection.db!;
  await db.collection("retros").dropIndex("userId_1");
  
  console.log("✅ Usunięto stary indeks userId_1");
  process.exit(0);
}).catch(err => {
  console.error("Błąd:", err);
  process.exit(1);
});
