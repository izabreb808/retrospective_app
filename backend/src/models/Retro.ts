import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  text: String,
  votes: { type: Number, default: 0 },
});

const columnSchema = new mongoose.Schema({
  id: String,
  title: String,
  cards: [cardSchema],
});

const retroSchema = new mongoose.Schema({
  userId: String,
  columns: [columnSchema],
  createdAt: { type: Date, default: Date.now },
});

export const Retro = mongoose.model("Retro", retroSchema);
