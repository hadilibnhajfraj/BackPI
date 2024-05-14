const express = require("express");
const router = express.Router();
const messagecontroller = require("../controller/mesageController");
router.post('/add', messagecontroller.add);
router.get('/showall',messagecontroller.show);
router.put('/update/:id',messagecontroller.update);
router.delete('/delete/:id',messagecontroller.deletemessage);

module.exports = router;