const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/userController");
router.post('/add', usercontroller.add);
router.get('/showall',usercontroller.show);
router.put('/update/:id',usercontroller.update);
router.delete('/delete/:id',usercontroller.deleteuser);

module.exports = router;