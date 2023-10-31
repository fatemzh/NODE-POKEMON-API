// Définition du modèle User pour l'authentification avec Sequelize
module.exports = (sequelize, DataTypes) => {
  // La fonction "define" de Sequelize permet de définir un modèle
  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      unique:{
          message: 'Ce pseudo est déjà pris.'
      }
    },
    password: {
      type: DataTypes.STRING
    }
  })
}
