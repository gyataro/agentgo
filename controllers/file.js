const fileRouter = require("express").Router();
const File = require("../models/file");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

fileRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const result = await File.findById(id);
  if (!result) return response.status(404).json({ error: "Not found." });
  return response.type("application/pdf").send(result.data);
});

fileRouter.post("/", upload.any(), async (request, response) => {
  const data = request.files[0].buffer;
  const file = File({ data });
  file.save();
  return response.status(201).json({ _id: file._id });
});

module.exports = fileRouter;
