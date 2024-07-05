const Message = require("../model/mesage");
const multer = require("multer");
const path = require("path");
const User = require("../model/user"); // Assuming you have a User model
const Etudiant = require("../model/etudiant");
const Block = require("../model/block");

// Configuration du stockage pour les images et les fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, "uploads/images/");
    } else if (file.fieldname === "fichier") {
      cb(null, "uploads/files/");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialisation de Multer avec des filtres de type de fichier
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === "image") {
      checkFileType(file, cb, /jpeg|jpg|png|gif/);
    } else if (file.fieldname === "fichier") {
      checkFileType(file, cb, /pdf|doc|docx|xls|xlsx|txt/);
    }
  },
});

// Fonction de vérification des types de fichiers
function checkFileType(file, cb, filetypes) {
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Type de fichier non valide!");
  }
}

async function detectModel(id) {
  // Try to find the id in the User collection
  const user = await User.findById(id);
  if (user) return "User";

  // If not found in User, try to find the id in the Etudiant collection
  const etudiant = await Etudiant.findById(id);
  if (etudiant) return "Etudiant";

  // If not found in either, return null
  return null;
}

async function add(req, res, next) {
  try {
    // Utilisation de upload.fields pour gérer les téléchargements de fichiers multiples
    upload.fields([{ name: "image" }, { name: "fichier" }])(
      req,
      res,
      async function (err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const { id_user_envoie, id_user_receive, message } = req.body;

        // Debugging: Log the req.files object
        console.log("req.files:", req.files);

        // Detecter les modèles pour jsoner et receiver
        const envoieModel = await detectModel(id_user_envoie);
        const receiveModel = await detectModel(id_user_receive);

        if (!envoieModel || !receiveModel) {
          return res
            .status(400)
            .json({ error: "Invalid jsoner or receiver ID." });
        }

        // Vérifier si le jsoner a bloqué le receiver
        const blockExistsjsonerToReceiver = await Block.exists({
          blocker: id_user_envoie,
          blockerModel: envoieModel,
          blocked: id_user_receive,
          blockedModel: receiveModel,
        });

        // Vérifier si le receiver a bloqué le jsoner
        const blockExistsReceiverTojsoner = await Block.exists({
          blocker: id_user_receive,
          blockerModel: receiveModel,
          blocked: id_user_envoie,
          blockedModel: envoieModel,
        });

        if (blockExistsjsonerToReceiver || blockExistsReceiverTojsoner) {
          return res.status(403).json({
            error:
              "Vous ne pouvez pas envoyer de message à cet utilisateur car il vous a bloqué.",
          });
        }

        // Créer un nouvel objet message
        const newMessage = new Message({
          id_user_envoie,
          envoieModel,
          id_user_receive,
          receiveModel,
          timestamp: new Date(),
        });

        // Ajouter le message s'il est présent dans la requête
        if (message) {
          newMessage.message = message;
        }

        // Ajouter le chemin de l'image si une image a été téléchargée
        if (req.files && req.files["image"]) {
          newMessage.image = req.files["image"][0].path;
        }

        // Ajouter le chemin du fichier si un fichier a été téléchargé
        if (req.files && req.files["fichier"]) {
          newMessage.fichier = req.files["fichier"][0].path;
        }

        await newMessage.save();
        return res.status(200).json({ message: "Message ajouté avec succès" });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur lors de l'ajout du message" });
  }
}

async function show(req, res, next) {
  try {
    const data = await Message.find();
    const formattedData = data.map((message) => {
      const { timestamp, ...rest } = message.toObject(); // Extracting timestamp and other fields
      const date = timestamp.toDateString(); // Extracting date
      const time = timestamp.toLocaleTimeString(); // Extracting time
      return { ...rest, date, time }; // Combining all fields
    });
    res.json(formattedData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function update(req, res, next) {
  try {
    const { id_user_envoie, id_user_receive } = req.body;

    // Detect models for jsoner and receiver
    const envoieModel = await detectModel(id_user_envoie);
    const receiveModel = await detectModel(id_user_receive);

    if (!envoieModel || !receiveModel) {
      return res.status(400).json("Invalid jsoner or receiver ID.");
    }

    // Construct the update object including timestamp and other fields from req.body
    const updateData = {
      ...req.body,
      envoieModel,
      receiveModel,
      timestamp: new Date(), // Update the timestamp to the current time
    };

    // Update the document with the new timestamp and other fields
    const data = await Message.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!data) {
      return res.status(404).json("Message not found");
    }

    res.status(200).json("Message updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deletemessage(req, res, next) {
  try {
    const data = await Message.findByIdAndDelete(req.params.id, req.body);
    res.json("removed");
  } catch (err) {}
}

async function getUserConversations(req, res) {
  const userId = req.params.userId;

  try {
    // Retrieve all messages involving the user whose ID is userId
    const messages = await Message.find({
      $or: [{ id_user_envoie: userId }, { id_user_receive: userId }],
    });

    // Create a Set to store unique IDs of users with whom the user has conversations
    const userIds = new Set();

    // Iterate through the messages and extract the IDs of jsoners and receivers
    for (const message of messages) {
      if (
        message.id_user_envoie &&
        message.id_user_envoie.toString() !== userId
      ) {
        userIds.add(`${message.id_user_envoie}-${message.envoieModel}`);
      }
      if (
        message.id_user_receive &&
        message.id_user_receive.toString() !== userId
      ) {
        userIds.add(`${message.id_user_receive}-${message.receiveModel}`);
      }
    }

    // Convert the Set into an array of IDs
    const userIdArray = Array.from(userIds);

    // Fetch user information from User and Etudiant collections
    const users = await Promise.all(
      userIdArray.map(async (userId) => {
        const [id, model] = userId.split("-");
        if (model === "User") {
          return await User.findById(id).select("firstName lastName");
        } else if (model === "Etudiant") {
          return await Etudiant.findById(id).select("firstName lastName");
        }
        return null;
      })
    );

    // Filter results to remove null values (if a user is not found)
    const validUsers = users
      .filter((user) => user)
      .map((user) => ({
        _id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
      }));

    res.status(200).json(validUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération des utilisateurs.",
    });
  }
}

async function afficherConversation(id_user1, id_user2) {
  try {
    const messages = await Message.find({
      $or: [
        { id_user_envoie: id_user1, id_user_receive: id_user2 },
        { id_user_envoie: id_user2, id_user_receive: id_user1 },
      ],
    }).sort({ timestamp: 1 });

    if (messages.length === 0) {
      return {
        status: 404,
        message: "Aucun message trouvé entre ces utilisateurs.",
      };
    } else {
      // Update unread messages to "lu"
      for (let message of messages) {
        if (message.etat === "non lu") {
          message.etat = "lu";
          await message.save();
        }
      }
      return { status: 200, data: messages };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return {
      status: 500,
      error: "Erreur lors de la récupération des messages",
    };
  }
}

async function obtenirUtilisateursEtEtudiantsActives(req, res) {
  try {
    const usersActives = await User.find(
      { activated: true },
      { _id: 1, firstName: 1, lastName: 1, authorities: 1 }
    );

    const etudiantsActives = await Etudiant.find(
      { activated: true },
      { _id: 1, firstName: 1, lastName: 1 }
    );

    console.log("Utilisateurs activés:", usersActives); // Log utilisateurs activés
    console.log("Étudiants activés:", etudiantsActives); // Log étudiants activés

    const usersFormatted = usersActives.map((user) => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.authorities, // Liste des rôles de l'utilisateur
    }));

    const etudiantsFormatted = etudiantsActives.map((etudiant) => ({
      id: etudiant._id,
      name: `${etudiant.firstName} ${etudiant.lastName}`,
      role: ["etudiant"], // Étudiant a un rôle fixe
    }));

    const resultat = [...usersFormatted, ...etudiantsFormatted];

    console.log("Résultat combiné:", resultat); // Log résultat combiné

    return res.status(200).json(resultat);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des utilisateurs et étudiants activés:",
      error
    );
    return res.status(500).json({
      error:
        "Erreur lors de la récupération des utilisateurs et étudiants activés",
    });
  }
}

async function bloquerUtilisateur(req, res) {
  const { blockerId, blockedId } = req.params;

  // Vérifier si les IDs sont fournis
  if (!blockerId || !blockedId) {
    return res
      .status(400)
      .json({ error: "Les IDs blockerId et blockedId sont requis." });
  }

  try {
    // Vérifier si les IDs sont valides
    const blockerUser = await User.findById(blockerId);
    const blockerEtudiant = await Etudiant.findById(blockerId);
    const blockedUser = await User.findById(blockedId);
    const blockedEtudiant = await Etudiant.findById(blockedId);

    // Déterminer les modèles pour chaque ID
    let blockerModel = blockerUser
      ? "User"
      : blockerEtudiant
      ? "Etudiant"
      : null;
    let blockedModel = blockedUser
      ? "User"
      : blockedEtudiant
      ? "Etudiant"
      : null;

    // Vérifier si les modèles sont valides
    if (!blockerModel || !blockedModel) {
      return res.status(400).json({ error: "Les IDs fournis sont invalides." });
    }

    const existingBlock = await Block.findOne({
      $or: [
        { blocker: blockerId, blockerModel, blocked: blockedId, blockedModel },
        {
          blocker: blockedId,
          blockerModel: blockedModel,
          blocked: blockerId,
          blockedModel: blockerModel,
        },
      ],
    });

    if (existingBlock) {
      return res.status(400).json({ error: "Ce blocage existe déjà." });
    }

    // Créer une nouvelle entrée de blocage
    const newBlock = new Block({
      blocker: blockerId,
      blockerModel,
      blocked: blockedId,
      blockedModel,
    });

    await newBlock.save();

    return res.status(200).json({ message: "Blocage effectué avec succès." });
  } catch (error) {
    console.error("Erreur lors du blocage:", error);
    return res.status(500).json({ error: "Erreur lors du blocage." });
  }
}

async function genererNotification(req, res) {
  const userId = req.params.id;
  try {
    // Rechercher les messages non lus pour l'utilisateur donné et joindre la collection d'utilisateurs
    const unreadMessages = await Message.find({
      id_user_receive: userId,
      receiveModel: "User",
      etat: "non lu",
    })
      .populate("id_user_envoie", "firstName lastName") // Joindre la collection d'utilisateurs et sélectionner seulement le prénom et le nom de famille
      .exec();

    // Si des messages non lus sont trouvés, générer un message de notification
    if (unreadMessages.length > 0) {
      const notifications = unreadMessages.map((message) => {
        return {
          jsoner: `${message.id_user_envoie.firstName} ${message.id_user_envoie.lastName}`,
          content: message.message,
        };
      });
      res.status(200).json({
        notifications,
        notification: `Vous avez ${unreadMessages.length} nouveaux messages.`,
      }); // Envoyer les notifications et la notification dans la réponse
    } else {
      res.status(200).json({
        notifications: [],
        notification: "Aucune nouvelle notification.",
      }); // Si aucune notification n'est trouvée
    }
  } catch (error) {
    console.error("Erreur lors de la génération de la notification:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la génération de la notification." }); // En cas d'erreur
  }
}

async function getMessage(req, res, next) {
  try {
    const bus = await Message.findById(req.params.id);
    if (!bus) {
      return res.status(404).json("reclamation not found");
    }
    res.json(bus);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error fetching chauffeur");
  }
}
async function countNotif(req, res) {
  try {
    const userId = req.params.userId;

    // Requête pour compter les messages reçus par l'utilisateur spécifié
    const count = await Message.countDocuments({ id_user_receive: userId });

    res.json({ count });
  } catch (error) {
    console.error("Error counting messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function getNotification(req, res) {
  try {
    const userId = req.params.userId;

    // Requête pour récupérer tous les messages reçus par l'utilisateur spécifié
    const messages = await Message.find({
      id_user_receive: userId  // Assurez-vous que userId est correctement formaté
      // Vous pouvez également retirer etat: "non lu" pour récupérer tous les messages reçus par l'utilisateur
    })
      .populate("id_user_envoie", "firstName lastName")
      .populate("id_user_receive", "firstName lastName")
      .exec();

    // Compter le nombre de messages non lus
    const count = messages.length;

    // Construire la réponse JSON
    const formattedMessages = messages.map((msg) => ({
      sender: `${msg.id_user_envoie.firstName} ${msg.id_user_envoie.lastName}`,
      receiver: `${msg.id_user_receive.firstName} ${msg.id_user_receive.lastName}`,
      message: msg.message,
      timestamp: msg.timestamp,
    }));

    res.json({
      count,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("Error counting messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  add,
  show,
  update,
  deletemessage,
  getUserConversations,
  afficherConversation,
  obtenirUtilisateursEtEtudiantsActives,
  bloquerUtilisateur,
  genererNotification,
  getMessage,
  countNotif,
  getNotification,
};
