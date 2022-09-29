const sellRouter = require("express").Router();
const Sell = require("../models/sell");
const File = require("../models/file");
const FormData = require("form-data");
const ejs = require("ejs");
const currency = require("../utils/currency");
const config = require("../utils/config");
const fetch = require("node-fetch");
const fs = require("fs");
var template = ejs.compile(
  fs.readFileSync(__dirname + "/../templates/sell.ejs", "utf8")
);

sellRouter.get("/", async (request, response) => {
  const selection = "address caseNumber reference";
  const cases = await Sell.find().select(selection);
  return response.json(cases);
});

sellRouter.post("/", async (request, response) => {
  const body = request.body;
  const sell = new Sell({ ...body });
  const result = await sell.save();
  return response.status(201).json(result);
});

sellRouter.get("/:id", async (request, response) => {
  const caseId = request.params.id;
  const result = await Sell.findById(caseId);
  if (!result) return response.status(404).json({ error: "Not found." });
  return response.json(result);
});

sellRouter.post("/:id/agreement/create", async (request, response) => {
  const caseId = request.params.id;
  const sell = await Sell.findById(caseId);

  if (!sell) {
    return response.status(404).json({ error: "Not found." });
  }

  const agreement = sell.agreement;

  if (agreement.fileId) {
    const result = await File.findById(agreement.fileId);
    return response.type("application/pdf").send(result.data);
  }

  agreement.address = sell.address;
  agreement.parties = getParties(sell.parties);
  agreement.priceDigit = agreement.price.toLocaleString();
  agreement.priceWord = currency.toWords(agreement.price);

  const pdfResult = await fetch(
    `${config.GOTENBERG_URL}/forms/chromium/convert/html`,
    {
      method: "POST",
      body: getForm(agreement),
    }
  );

  const result = await pdfResult.buffer();
  const file = File({ data: result });
  file.save();
  sell.agreement.fileId = file._id;
  sell.save();

  return response.type("application/pdf").send(result);
});

// Extract the buyer, seller, agent in the case.
const getParties = (parties) => {
  const result = {
    agent: null,
    buyers: [],
    sellers: [],
  };

  for (var party of parties) {
    if (party.role === "AGENT") result.agent = party;
    else if (party.role === "BUYER") result.buyers.push(party);
    else if (party.role === "SELLER") result.sellers.push(party);
  }

  return result;
};

// Prepare FormData from .ejs template.
const getForm = (agreement) => {
  const html = template({ ...agreement });
  const formData = new FormData();
  formData.append("files", html, { filename: "index.html" });
  formData.append("marginTop", "0");
  formData.append("marginBottom", "0");
  formData.append("marginLeft", "0");
  formData.append("marginRight", "0");
  formData.append("paperWidth", "8.27");
  formData.append("paperHeight", "11.7");
  return formData;
};

module.exports = sellRouter;
