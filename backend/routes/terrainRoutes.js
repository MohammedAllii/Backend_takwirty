const express = require('express')
const router = express.Router()
const {
  getTerrains,
  getAllTerrains,
  setTerrain,
  updateTerrain,
  deleteTerrain,
  getTerrainById,
  deleteTerrainAdmin,
  acceptTerrain,
  getAllTerrainByStatue,
  upgradeTerrain
  
} = require('../controllers/terrainController')

const { protect } = require('../middleware/authMiddleware')
router.route('/all').get(getAllTerrains)
router.route('/').get(protect, getTerrains).post(protect,setTerrain)
router.route('/:id').delete(protect, deleteTerrain).put(protect, updateTerrain)
router.route('/:id').get(protect, getTerrainById);
router.route('/:id/admin').delete(deleteTerrainAdmin)
router.route('/add/:id').put(acceptTerrain)
router.get('/terrains/alls', getAllTerrainByStatue);
router.route('/up/:id').put(upgradeTerrain)


module.exports = router