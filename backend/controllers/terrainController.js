const asyncHandler = require('express-async-handler')

const Terrain = require('../models/terrainModel')
const Reservation = require('../models/reservationModel')
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // set the upload directory
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, Date.now() + extension); // use the original file name
  }
});
const upload = multer({ storage: storage });

//get terrain by user
const getTerrains = asyncHandler(async (req, res) => {
  const terrains = await Terrain.find({ user: req.user.id, etat: 1 })

  res.status(200).json(terrains)
});
//recherche 
const getAllTerrains = asyncHandler(async (req, res) => {
  const query = req.query.q; // get the 'q' query parameter from the request
  let terrains;

  if (query) {
    terrains = await Terrain.find({
    $and: [{ etat: 1 }, { $or: [
    { nom: { $regex: query, $options: "i" } },
    { adresse: { $regex: query, $options: "i" } },
    ] }],
    });
    } else {
    terrains = await Terrain.find({ etat: 1 });
    }

  res.status(200).json(terrains);
});


const setTerrain = asyncHandler(async (req, res) => {
  if (!req.body.nom) {
    res.status(400)
    throw new Error('Champ nom vide ')
  }
  if (!req.body.description) {
    res.status(400)
    throw new Error('Champ description vide  ')
  }
  if (!req.body.adresse) {
    res.status(400)
    throw new Error('Champ adresse vide  ')
  }
  if (!req.body.prix) {
    res.status(400)
    throw new Error('Champ prix vide  ')
  }
  if (!req.file) { // check if the image file is uploaded
    res.status(400);
    throw new Error('Sélectionner votre image  ');
  }

  const terrainu = await Terrain.create({
    nom: req.body.nom,
    description: req.body.description,
    adresse: req.body.adresse,
    prix: req.body.prix,
    image: req.file.filename,
    user: req.user.id,
    
  })

  res.status(200).json(terrainu)
})


const updateTerrain = asyncHandler(async (req, res) => {
  const terrain = await Terrain.findById(req.params.id)

  if (!terrain) {
    res.status(400)
    throw new Error('terrain non trouve')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User non trouve')
  }

  if (terrain.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User non authorise')
  }

  let newImageName;
  if (req.file) {
    //  image file is uploaded
    newImageName = req.file.filename;
  } else {
    // no
    newImageName = terrain.image;
  }

  const updatedterrain = await Terrain.findByIdAndUpdate(
    req.params.id,
    {
      nom: req.body.nom || terrain.nom,
      description: req.body.description || terrain.description,
      adresse: req.body.adresse || terrain.adresse,
      prix: req.body.prix || terrain.prix,
      image: newImageName
    },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json(updatedterrain)
})




const deleteTerrain = asyncHandler(async (req, res) => {
  const terrainId = req.params.id;

  // Find terrain by ID
  const terrain = await Terrain.findById(terrainId);

  if (!terrain) {
    res.status(400);
    throw new Error('Terrain non trouvé');
  }


  // Delete all reservations
  await Reservation.deleteMany({ terrain: terrainId });

  // Delete the terrain
  await terrain.remove();

  res.status(200).json({ id: terrainId });
});



//get terrain by id
const getTerrainById = asyncHandler(async (req, res) => {
  const terrain = await Terrain.findById(req.params.id);

  if (!terrain) {
    res.status(404);
    throw new Error('Terrain non trouvé');
  }

  res.status(200).json(terrain);
});

const deleteTerrainAdmin = asyncHandler(async (req, res) => {
  const terrain = await Terrain.findById(req.params.id)

  if (!terrain) {
    res.status(400)
    throw new Error('Terrain non trouve')
  }
  await terrain.remove()
  res.status(200).json({ id: req.params.id })
})

const acceptTerrain = asyncHandler(async (req, res) => {
  const terrain = await Terrain.findById(req.params.id);

  if (!terrain) {
    res.status(400);
    throw new Error('terrain not found');
  }
  const etat = 1;
  const updatedterrain = await Terrain.findByIdAndUpdate(
    req.params.id,
    { etat },
    { new: true }
  );

  res.status(200).json(updatedterrain);
});

const getAllTerrainByStatue = asyncHandler(async (req, res) => {
  const etatnumber=req.query.etat;
  const terrains = await Terrain.find({etat:parseInt(etatnumber)})

  if (!terrains) {
    res.status(404);
    throw new Error('terrains not found');
  }

  res.status(200).json(terrains);
});

const upgradeTerrain = asyncHandler(async (req, res) => {
  const terrain = await Terrain.findById(req.params.id);

  if (!terrain) {
    res.status(400);
    throw new Error('terrain not found');
  }
  const etat = 2;
  const updatedterrain = await Terrain.findByIdAndUpdate(
    req.params.id,
    { etat },
    { new: true }
  );

  res.status(200).json(updatedterrain);
});

module.exports = {
  getTerrains,
  getAllTerrains,
  setTerrain,
  updateTerrain,
  deleteTerrain,
  getTerrainById,
  acceptTerrain,
  deleteTerrainAdmin,
  getAllTerrainByStatue,
  upgradeTerrain
  
}