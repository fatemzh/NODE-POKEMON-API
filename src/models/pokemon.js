// Liste des types de Pokémon valides
const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée']

// Exportation du modèle Sequelize pour les Pokémons
module.exports = (sequelize, DataTypes) => {
    // La fonction "define" de Sequelize permet de définir un modèle
    return sequelize.define('Pokemon', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {message: "Ce nom est déjà pris."},
        validate: {
          notEmpty: {message: "Veuillez remplir le champ nom."},
          notNull: {message: "Le nom est une propriété requise."},
          min: {args: [1], message: "Le nom doit contenir au moins une lettre."},
          max: {args: [25], message: "Le nom ne peut contenir plus de 25 lettres."}
        }
      },
      hp: { 
        type: DataTypes.INTEGER,
        allowNull: false, 
        validate: {
          isInt: {message : "Veuillez saisir uniquement des nombres entiers pour les points de vie."},
          notNull: {message: "Les points de vie sont une propriété requise."},
          min: {args: [0], message: "Les points de vie doivent être inclus entre 0 et 999."},
          max: {args: [999], message: "Les points de vie doivent être inclus entre 0 et 999."},
        }
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {message : "Veuillez saisir uniquement des nombres entiers pour les points d'attaque."},
          notNull: {message: "Les points de combat sont une propriété requise."},
          min: {args: [0], message: "Les points de vie doivent être inclus entre 0 et 99."},
          max: {args: [99], message: "Les points de vie doivent être inclus entre 0 et 99."},
        }
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: {message : "Veuillez entrer une URL uniquement."},
          notNull: {message: "L'URL d'une image est requise."}
        }
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isTypesValid(value)
          {
            if(!value)
            {
              throw new Error ("Un pokémon doit avoir au moins un type.")
            }
            if(value.split(",").length > 3)
            {
              throw new Error ("Un pokémon ne peut pas avoir plus de 3 types.")
            }
            value.split(",").forEach(type =>{
              if(!validTypes.includes(type)){
                throw new Error (`Le type d'un pokémon doit appartenir à la liste suivante ${validTypes}`)
              }
            })
          }
        },
        // Getter pour récupérer les types sous forme de tableau
        get() {
          const types = this.getDataValue('types');
          return types ? types.split(',') : [];
        },
        // Setter pour définir les types sous forme de chaîne de caractères
        set(types){
          this.setDataValue('types', types.join())
        }
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    })
  }
