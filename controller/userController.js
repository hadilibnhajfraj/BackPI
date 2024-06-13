const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
var nodemailer = require("nodemailer");
const jwtkey = require("../config/dbconnection.json").jwtkey;
/*exports.login = async (req, res) => {
    try {
        // Check if the user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        // Check if the password is correct
        /*const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // User is authenticated, now generate a token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.authorities },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send the token to the client
        res.json({ message: 'Auth successful', token: token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error });
    }
};*/

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email + " : " + password);
      if (!email || !password) {
        return res.status(422).json({ error: "Invalid email or password" });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(422).json({ error: "Invalid email or password" });
      }
  
      try {
        // Comparer le mot de passe saisi avec le mot de passe hashé stocké
        await user.comparePassword(password);
  
        // Si la comparaison est réussie, générer un token JWT
        const token = jwt.sign({ userId: user._id }, jwtkey);
        res.send({ token });
      } catch (e) {
        // Si la comparaison échoue, envoyer une réponse d'erreur
        console.error(e);
        return res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
 
exports.createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", userId: newUser._id });
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};
// Forget Password
// Fonction pour générer un code de réinitialisation aléatoire
function generateResetCode() {
    const resetCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()
      .slice(0, 6);
    // La méthode toString('hex') génère une chaîne hexadécimale, et nous prenons les 6 premiers caractères pour obtenir un code de 6 chiffres
    return resetCode;
  }
  
  // Fonction pour envoyer le code de réinitialisation du mot de passe par email
  // Fonction pour envoyer le code de réinitialisation du mot de passe par email
async function sendResetCodeByEmail(email, resetCode) {
    // Configurer le transporteur Nodemailer (ajustez les paramètres selon votre fournisseur de messagerie)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "t0429597@gmail.com",
        pass: "frrz sozl ivqu fudj",
      },
      secure: true, // Utilisez le port sécurisé
      port: 587, // Port sécurisé pour Gmail
    });
  
    // Définir les options du message
    const mailOptions = {
      from: "t0429597@gmail.com",
      to: email,
      subject: "Réinitialisation de mot de passe",
      text: `Votre code de réinitialisation de mot de passe est : ${resetCode}`,
    };
  
    // Envoyer l'email
    await transporter.sendMail(mailOptions);
  }
  
  // Fonction pour générer et envoyer le code de réinitialisation du mot de passe
  exports.forgetPassword =  async (req, res, next) =>{
    const { email } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).send("User not exist");
      }
  
      // Generate a reset code
      const resetCode = generateResetCode();
      console.log("Generated reset code: " + resetCode); // Debugging
  
      // Save the reset code in the database
      user.resetCode = resetCode; // Set the reset code for the user
  
      // Ensure that the user is saved with the reset code
      await user.save();
  
      // Send the reset code by email
      await sendResetCodeByEmail(email, resetCode);
  
      res.status(200).json({ message: "Reset code sent successfully" });
    } catch (error) {
      // Handle errors appropriately
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
  exports.verifyResetCode= async (req, res, next) => {
    const { enteredCode } = req.body;
    const { email } = req.params;
  
    try {
      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).send("Utilisateur inexistant");
      }
  
      // Récupérer le code de réinitialisation enregistré dans la base de données
      const resetCodeFromDB = user.resetCode;
  
      // Vérifier si le code de réinitialisation est correct
      if (enteredCode !== resetCodeFromDB) {
        console.log("Code de réinitialisation invalide : " + enteredCode);
        console.log("Code de réinitialisation enregistré : " + resetCodeFromDB);
        return res.status(200).send("Code de réinitialisation invalide");
      }
  
      // Code de réinitialisation correct
  
      // Répondre avec succès si le code de réinitialisation est correct
      return res.status(200).send("Code de réinitialisation valide");
    } catch (error) {
      // Gérer les erreurs de manière appropriée
      console.error(error);
      return res.status(500).send("Erreur interne du serveur");
    }
  }
  exports.resetPasswordCode= async (req, res, next) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    try {
      // Find the user by id
      const oldUser = await User.findOne({ _id: id });
  
      if (!oldUser) {
        console.log("User not found");
        return res.status(404).json({ status: "user not exist" });
      }
  
      // Verify the token
      console.log("Token to verify:", token); // Ajout du log pour voir le token à vérifier
      jwt.verify(token, jwtkey, async (err, decodedToken) => {
        if (err) {
          // Token is not valid
          console.error("Token verification failed:", err);
          return res.status(401).json({ status: "not verified" });
        }
        console.log("Password to encrypt:", password); // Ajout du log pour voir la valeur de password
        const encryptPassword = await bcrypt.hash(password, 10);
  
        await User.updateOne(
          {
            _id: id,
          },
          {
            $set: {
              password: encryptPassword,
            },
          }
        );
  
        console.log("Password updated successfully", password);
        res.status(200).json({ status: "password updated" });
      });
    } catch (error) {
      // Handle errors appropriately
      console.error("Internal server error:", error);
      res.status(500).json({ status: "internal server error" });
    }
  }
  exports.resetPassword= async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    const { email } = req.params;
  
    try {
      // Rechercher l'utilisateur par son adresse e-mail
      const oldUser = await User.findOne({ email });
  
      if (!oldUser) {
        console.log("Utilisateur introuvable");
        return res.status(404).json({ status: "user not exist" });
      }
  
      // Vérifier si les mots de passe correspondent
      if (password !== confirmPassword) {
        return res.status(400).json({ status: "Passwords do not match" });
      }
  
      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Mettre à jour le mot de passe de l'utilisateur
      oldUser.password = hashedPassword;
  
      // Enregistrer les modifications dans la base de données
      await oldUser.save();
  
      // Mot de passe mis à jour avec succès
      console.log("Mot de passe mis à jour avec succès");
      console.log("Hashed Password :", hashedPassword);
      console.log(oldUser);
  
      return res.status(200).json({ status: "Password updated successfully" });
    } catch (error) {
      // Gérer les erreurs
      console.error("Erreur interne du serveur:", error);
      return res.status(500).json({ status: "internal server error" });
    }
  }
  