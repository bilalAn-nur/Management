const mongoose = require("mongoose");

const promanSchema = new mongoose.Schema({
  date: { type: String, required: true },
  promanCategory: { type: String, required: true },
  odpData: [
    {
      odpName: { type: String, required: true },
      status: { type: String, required: true },
      petugas: [{ type: String, required: true }],
    },
  ],
  inputBy: { type: String, required: true },
});

const ODP = mongoose.model("Proman", promanSchema);

module.exports = ODP;
