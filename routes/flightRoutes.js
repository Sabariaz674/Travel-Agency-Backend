const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { createFlight, updateFlight, getFlights, deleteFlight } = require('../controllers/flightController');
router.post('/createFlight', upload.single('logo'), createFlight);
router.put('/:id', upload.single('logo'), updateFlight);
router.get('/', getFlights);
router.delete('/:id', deleteFlight);

module.exports = router;
