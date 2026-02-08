const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService, // Added
  deleteService,
} = require('./controller');

router.route('/').get(getServices).post(createService);
router.route('/:id').put(updateService).delete(deleteService); // Added put

module.exports = router;
