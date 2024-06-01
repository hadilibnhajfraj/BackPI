const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');



router.post('/login', userController.login);

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post("/forgetpassword", userController.forgetPassword);
router.put("/resetpassword/:email", userController.resetPassword);
router.get("/resetpasswordcode/:id/:token", userController.resetPasswordCode);
router.post("/resetCode/:email", userController.verifyResetCode);
module.exports = router;
