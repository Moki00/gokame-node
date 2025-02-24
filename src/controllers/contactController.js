const { body, validationResult } = require("express-validator"); // Form validation
const multer = require("multer"); // File upload middleware
const path = require("path"); // directory path utility
const { sendEmail } = require("../config/emailService"); // Email service
const db = require("../config/db"); // Database connection
const fs = require("fs"); // File System utility

async function waitForFile(filePath, maxAttempts = 10, delayMs = 500) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch (err) {
      console.log(`⏳ Waiting for file (${attempts + 1}/${maxAttempts})...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      attempts++;
    }
  }
  return false;
}

// generate unique file names
const { nanoid } = require("nanoid");

// multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/"); // Store location
  },
  filename: function (req, file, cb) {
    cb(null, nanoid(7) + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|docx|txt/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype =
      filetypes.test(file.mimetype) || file.mimetype === "text/plain";

    console.log("extname:", extname, "mimetype:", mimetype);
    console.log("file.mimetype:", file.mimetype);
    console.log("file.originalname:", file.originalname);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(
        new Error(
          "Invalid file type. Only JPG, PNG, PDF, TXT and DOCX are allowed."
        )
      );
    }
  },
});

// Validation rules for the form
const validateContactForm = [
  body("from_name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters."),
  body("phone_number")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be 10 numbers."),
  body("email").isEmail().withMessage("Invalid email address."),
  body("message")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Message must be at least 5 characters."),
];

// Handle form submission
async function contactFormHandler(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { from_name, phone_number, email, message } = request.body;
  const filePath = request.file
    ? path.join(__dirname, "..", "uploads", request.file.filename)
    : null;

  try {
    // Wait for file to be created (Retries up to 2.5 seconds)
    if (filePath && !(await waitForFile(filePath))) {
      console.error("❌ File not found after waiting:", filePath);
      return response
        .status(500)
        .json({ message: "File upload failed, please try again." });
    }

    // Store data in MySQL
    const sql = `INSERT INTO contacts (from_name, phone_number, email, message, file_path) VALUES (?, ?, ?, ?, ?)`;
    await db.execute(sql, [from_name, phone_number, email, message, filePath]);

    // Send email with attachment
    const subject = "New Contact Form Submission";
    let text = `Name: ${from_name}\nPhone: ${phone_number}\nEmail: ${email}\nMessage: ${message}`;

    const sentEmail = await sendEmail(
      process.env.CONTACT_EMAIL,
      subject,
      text,
      filePath
    );

    if (sentEmail.success) {
      response.status(200).json({ message: "Your message has been sent!" });
    } else {
      response
        .status(500)
        .json({ message: "Email sending failed, but the message was saved." });
    }
  } catch (error) {
    console.error("❌ Contact form error:", error);
    response.status(500).json({ message: "Server error." });
  }
}

module.exports = { validateContactForm, upload, contactFormHandler };
