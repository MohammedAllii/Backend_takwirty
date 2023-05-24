const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  updateUser,
  getUserById,
  getMe,
  getAllUserByStatue,
  upgradeUser,
  downgradeUser,
  updateUserPhone
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
router.get('/me', protect, getMe)
router.post('/', registerUser)
router.post('/login', loginUser)
router.route('/:id').put(protect, updateUser)
router.route('/:id').get(protect, getUserById)
router.get('/users/alls', getAllUserByStatue);
router.route('/up/:id').put(upgradeUser)
router.route('/down/:id').put(downgradeUser)
router.route('/phone').post(protect, updateUserPhone)



module.exports = router