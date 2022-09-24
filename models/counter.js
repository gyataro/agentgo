const mongoose = require("mongoose");

const counterSchema = mongoose.Schema({
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
  },
  counterType: {
    type: String,
    enum: ["SELL", "RENT"],
    required: true,
  },
  sequence: {
    type: Number,
    default: 0,
  },
});

counterSchema.static("getCaseNumber", async function (agencyId, counterType) {
  const query = { agencyId, counterType };
  const update = { $inc: { sequence: 1 } };
  const options = { new: true, upsert: true };
  const caseNumber = await this.findOneAndUpdate(query, update, options);
  return caseNumber;
});

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
