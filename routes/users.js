const express = require('express');
const {
    authenticateUser,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const router = express.Router();

router.get('/auth', authenticateUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/:id', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;