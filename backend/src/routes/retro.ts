const express = require("express");
const router = express.Router();
const { Retro } = require("../models/Retro");


// GET board
router.get("/:userId", async (req: { params: { userId: any; }; }, res: { json: (arg0: any) => void; }) => {
  let retro = await Retro.findOne({ userId: req.params.userId });

  if (!retro) {
    retro = await Retro.create({
      userId: req.params.userId,
      columns: [],
    });
  }

  res.json(retro);
});


// SAVE board (pełny zapis)
router.post("/:userId", async (req: { body: { columns: any; }; params: { userId: any; }; }, res: { json: (arg0: any) => void; }) => {
  const { columns } = req.body;

  const retro = await Retro.findOneAndUpdate(
    { userId: req.params.userId },
    { columns },
    { upsert: true, new: true }
  );

  res.json(retro);
});

module.exports = router;
