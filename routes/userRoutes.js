const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');



router.post('/login', userController.login);

router.post('/', userController.createUser);
router.get('/listeuser', userController.getAllUsers);
router.get('/getUser/:id', userController.getUserById);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);
router.post("/forgetpassword", userController.forgetPassword);
router.put("/resetpassword/:email", userController.resetPassword);
router.get("/resetpasswordcode/:id/:token", userController.resetPasswordCode);
router.post("/resetCode/:email", userController.verifyResetCode);
router.patch('/validate/:userId', userController.validateUser);
module.exports = router;
