const express = require("express");
const router = express.Router();
const coursController = require("../controller/coursController");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get("/all", coursController.show);

router.post("/add", coursController.add);

router.put("/update/:id", coursController.updated);

router.delete("/drop/:id", coursController.deleted);

router.get("/showById/:id", coursController.allbyId);

router.get("/showByName/:name", coursController.showByone);

router.get("/downloadDocument/:id/:docIndex", coursController.downloadDocument);

router.get("/search", coursController.search);

router.post("/chat", async (req, res) => {
  const { question } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = question;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ response: text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

module.exports = router;
