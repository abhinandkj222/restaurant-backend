const express = require('express')

const adminController = require('../controllers/adminController')
const itemController =require('../controllers/itemController')
const userController =require('../controllers/userController')
const chatController=require('../controllers/chatController')
const middleaware=require('../middleware/routerSpecific')

const router = new express.Router()

// routes for admin registartion
router.post('/admin/register',adminController.adminRegister)

router.post('/user/register',userController.userRegister)

router.post('/login',adminController.login)

router.post('/admin/add-item',middleaware.logMiddleware,itemController.addItem)

router.get('/admin/get-item',itemController.getitemAdmin)

router.get('/user/get-item',itemController.getitemUser)

router.post('/user/add-cart',middleaware.logMiddleware,userController.addTocart)

router.get('/user/view-cart',middleaware.logMiddleware,userController.getUserCart)

router.put('/user/updateQuantity',middleaware.logMiddleware,userController.updateCartItem)

router.post('/user/remove-cart',middleaware.logMiddleware,userController.removeCartItem)

router.post('/user/add-wishlist',middleaware.logMiddleware,userController.addToWishlist)

router.get('/user/view-wishlist',middleaware.logMiddleware,userController.getUserWishlist)

router.post('/user/remove-wishlist',middleaware.logMiddleware,userController.removeWishlistItem)


router.post('/create-order',middleaware.logMiddleware,userController.createOrder);

router.post('/create-booking',middleaware.logMiddleware,userController.createBooking)

router.post('/payment-success',middleaware.logMiddleware,userController.successpayment)

router.get('/user/view-bookings',middleaware.logMiddleware,userController.getBookingDetails)

router.get('/admin/view-orders',middleaware.logMiddleware,adminController.getOrders)

router.post('/admin/delete-item',middleaware.logMiddleware,adminController.deletItemByadmin)

router.delete('/user/clear-cart',middleaware.logMiddleware,userController.clearCart)

router.get('/admin/user-count',middleaware.logMiddleware,adminController.getUserCount)

router.get('/admin/booking-count',middleaware.logMiddleware,adminController.getBookingCount)

router.post('/user/delete-order',middleaware.logMiddleware,userController.deleteOrder)
router.post('/chat',chatController.chatWithBot);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password',userController.resetPassword);
module.exports= router