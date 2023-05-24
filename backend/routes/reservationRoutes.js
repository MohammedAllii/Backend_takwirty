const express = require('express')
const router = express.Router()
const {
  getReservation,
  getReservationStill,
  setReservation,
  accepterReservation,
  getHouravai,
  getDaysavai,
  deleteResv,
  getReservationByDate,
  rechercheReservationByDate,
  myreservationcount
  
} = require('../controllers/reservationController')

const { protect } = require('../middleware/authMiddleware')
router.route('/avaihours').get(getHouravai)
router.route('/avaidays').get(getDaysavai)
router.route('/still').get(protect, getReservationStill)
router.route('/myres').get(protect, myreservationcount)
router.route('/').get(protect, getReservation).post(protect,setReservation)
router.route('/:id/accept').put(accepterReservation)
router.get('/users/:userId/terrains/:terrainId', getReservationByDate);
router.get('/terrains/:terrainId/date/:date', rechercheReservationByDate);
router.get('/:reservationId', accepterReservation);
router.delete('/:id', deleteResv);


module.exports = router