var express = require('express');
var router = express.Router();

const TranscriptController = require('../controllers/transcript_correction.js');

/* GET home page. */
router.get('/local', TranscriptController.corrector_page_local);
router.get('/online', TranscriptController.corrector_page_online);
router.post('/save', TranscriptController.save_editted_transcript);

module.exports = router;
