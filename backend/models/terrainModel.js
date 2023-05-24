const mongoose = require('mongoose')

const terrainSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    nom: {
      type: String,
      required: [true, 'Svp ajouter nom'],
    },
    description: {
      type: String,
      required: [true, 'Svp ajouter description'],
    },
    adresse: {
      type: String,
      required: [true, 'Svp ajouter adresse'],
    },
    prix: {
      type: Number,
      required: [true, 'Svp ajouter prix'],
    },
    image: {
      type: String,
      required: [true, 'Svp ajouter image'],
    },
    etat: {
      type: Number,
      required: [false],
      default: 0,
    },
   
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Terrain', terrainSchema)