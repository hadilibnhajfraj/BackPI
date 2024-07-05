const express = require("express");
const router = express.Router();
const responceController = require("../controller/responceController");
router.post('/add', responceController.add);
router.get('/showall',responceController.show);
router.put('/update/:id',responceController.update);
router.delete('/delete/:id',responceController.deleteResponce);
router.get('/:reclamationId/responses', responceController.getAllResponsesForReclamation); 
router.get('/show/:id', responceController.getResponce);// New route

module.exports = router;