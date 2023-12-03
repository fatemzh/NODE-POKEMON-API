// Importation du modèle User depuis la configuration Sequelize
const { User } = require('../db/sequelize')

// Importation de la bibliothèque bcrypt pour la vérification des mots de passe
const bcrypt = require('bcrypt')

// Importation de la bibliothèque jwt pour la création de tokens d'authentification
const jwt = require('jsonwebtoken')

// Importation de la clé privée pour la signature des tokens JWT
const privateKey = require('../auth/private_key')

// Exportation d'une fonction qui prend en paramètre l'application Express
module.exports = (app) => {
  // Définition d'une route POST pour la connexion des utilisateurs
  app.post('/api/login', (req, res) => {
  
    // Recherche de l'utilisateur par son nom d'utilisateur
    User.findOne({ where: { username: req.body.username } }).then(user => {

        // Si l'utilisateur n'est pas trouvé, renvoie un message d'erreur
        if(!user)
        {
            const message = 'L\'utilisateur demandé n\'existe pas.' 
            return res.status(404).json({message})
        }

      // Vérification du mot de passe avec bcrypt
      bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
        // Si le mot de passe n'est pas valide, renvoie un message d'erreur
        if(!isPasswordValid) {
          const message = `Le mot de passe est incorrect.`;
          return res.status(404).json({ message})
        }

        // Si le mot de passe est valide, création d'un token JWT
        const token = jwt.sign(
            {userId : user.id},
            privateKey,
            {expiresIn: '24h'}
        )

        // Renvoie un message de succès avec le token JWT
        const message = `L'utilisateur a été connecté avec succès`;
        return res.json({ message, data: user, token})
      })
    })
    .catch(error =>{
        // Gestion des erreurs lors de la connexion
        const message = 'Connexion échouée, veuillez réessayer plus tard.'
        return res.json({message, data: error})
    })
  })
}
