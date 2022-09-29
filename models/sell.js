const mongoose = require("mongoose");

const structure = {
  address: {
    type: String,
    required: true,
  },
  /*
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
    required: true,
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  */
  caseNumber: {
    type: Number,
    required: true,
  },
  reference: {
    type: String,
  },
  parties: [
    {
      name: String,
      role: {
        type: String,
        enum: ["AGENT", "BUYER", "SELLER"],
      },
      identity: String,
      email: String,
      mobile: String,
      address: String,
      authorizationSignature: Buffer,
      agreementSignature: Buffer,
    },
  ],
  agreement: {
    fileId: String,
    price: Number,
    deposit: Number,
    depositRef: String,
    depositType: {
      type: String,
      enum: ["CHEQUE", "CASH"],
    },
    conditions: [String],
  },
  authorization: {
    fileId: String,
    price: Number,
    period: Number,
    conditions: [String],
  },
};

const options = {
  timestamps: true,
};

const sellSchema = new mongoose.Schema(structure, options);

const Sell = mongoose.model("Sell", sellSchema);

module.exports = Sell;
