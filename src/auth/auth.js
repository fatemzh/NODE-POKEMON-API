// Gère les tokens d'authentification
const jwt = require('jsonwebtoken')

// Importation de la clé privée pour vérifier le token JWT
const privateKey = require('../auth/private_key')

// Exportation d'un middleware pour vérifier l'authentification de l'utilisateur
module.exports = (req, res, next) => {
  // Récupération du token d'authentification depuis les en-têtes de la requête
  const authorizationHeader = req.headers.authorization
  
  // Vérification de la présence du token
  if(!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
    // Si le token est absent, renvoie une erreur 401 (non autorisé)
    return res.status(401).json({ message })
  }
    
  // Extraction du token depuis l'en-tête "Authorization" (format attendu : "Bearer TOKEN")
  const token = authorizationHeader.split(' ')[1]
  
  // Vérification du token avec la clé privée
  const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {
    // Si une erreur survient lors de la vérification, renvoie une erreur 401
    if(error) {
      const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`
      return res.status(401).json({ message, data: error })
    }
  
    // Récupération de l'identifiant utilisateur depuis le token décodé
    const userId = decodedToken.userId
    
    // Vérification de la correspondance entre l'identifiant utilisateur du token et celui du corps de la requête
    if (req.body.userId && req.body.userId !== userId) {
      const message = `L'identifiant de l'utilisateur est invalide.`
      // Si les identifiants ne correspondent pas, renvoie une erreur 401
      res.status(401).json({ message })
    } else {
      // Si tout est en ordre, passe au middleware suivant
      next()
    }
  })
}
