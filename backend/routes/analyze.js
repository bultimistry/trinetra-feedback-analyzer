const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { transcript } = req.body;

    res.json({
      message: "API working",
      transcript
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Something went wrong"
    });
  }
});

module.exports = router;