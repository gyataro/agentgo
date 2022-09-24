const sellRouter = require("express").Router();
const Sell = require("../models/sell");

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
  const cases = await Sell.findById(caseId);
  return response.json(cases);
});

module.exports = sellRouter;
