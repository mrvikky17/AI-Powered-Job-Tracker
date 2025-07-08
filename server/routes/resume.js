const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');

// basic skill keywords
const SKILL_KEYWORDS = ['JavaScript', 'React', 'Node', 'MongoDB', 'Python', 'SQL', 'CSS', 'HTML', 'Java', 'Docker'];

const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    const foundSkills = SKILL_KEYWORDS.filter(skill =>
      text.toLowerCase().includes(skill.toLowerCase())
    );

    res.json({ skills: foundSkills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process resume' });
  }
});

module.exports = router;
