const express = require('express');
const router = express.Router();

const csvReadControllers = require('../controllers/csvReadControllers');
const bookController = require('../controllers/bookController');

router.get('/read-csv', csvReadControllers.csvReader);

router.get('/search', bookController.getBook);

router.post('/add-book-magazine', bookController.addBook);

router.post('/sort', bookController.sortBooksMagazines);

module.exports = router;