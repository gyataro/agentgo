const fileRouter = require("express").Router();
const File = require("../models/file");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

fileRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const result = await File.findById(id);
  return response.json(result);
});

fileRouter.post("/", upload.any(), async (request, response) => {
  const data = request.files[0].buffer;
  const file = File({ data });
  file.save();
  return response.status(201).json({ _id: file._id });
});

module.exports = fileRouter;
