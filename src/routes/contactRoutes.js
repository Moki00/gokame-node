const express = require("express");
const {
  validateContactForm,
  upload,
  contactFormHandler,
} = require("../controllers/contactController");

const router = express.Router();

router.post(
  "/contact",
  upload.single("file"),
  validateContactForm,
  contactFormHandler
);

module.exports = router;
