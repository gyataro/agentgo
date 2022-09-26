const mongoose = require("mongoose");
const uuid = require("uuid");

const structure = {
  _id: {
    type: String,
    required: true,
    default: () => uuid.v4(),
  },
  data: {
    type: Buffer,
    required: true,
  },
};

const options = {
  timestamps: true,
};

const fileSchema = mongoose.Schema(structure, options);

const File = mongoose.model("File", fileSchema);

module.exports = File;
