import express from 'express'
import { loginSchema, signupSchema, contactSchema } from '../validators/auth-validator.js'
import { validate } from '../middlewares/validate-middleware.js'
const router = express.Router()
import * as authcontroller from '../controllers/auth-controller.js'
import { authMiddleware } from '../middlewares/auth-middleware.js'
import { adminMiddleware } from '../middlewares/admin-middleware.js'

const adminRouter = express.Router()

router.route('/home').get(authcontroller.home)
router.route('/register').post(validate(signupSchema), authcontroller.register)
router.route('/login').post(validate(loginSchema), authcontroller.login)
router.route('/contact').post(validate(contactSchema), authcontroller.contact)
router.route('/user').get(authMiddleware, authcontroller.user)
router.route('/services').get(authcontroller.services)

adminRouter.route('/user').get(authMiddleware, adminMiddleware, authcontroller.adminUser)
adminRouter.route('/user/:id/edit').get(authMiddleware, adminMiddleware, authcontroller.getUserById)
adminRouter.route('/user/:id/update').patch(authMiddleware, adminMiddleware, authcontroller.adminUserUpdate)
adminRouter.route('/user/delete/:id').delete(authMiddleware, adminMiddleware, authcontroller.adminUserDelete)
adminRouter.route('/contact').get(authMiddleware, adminMiddleware,authcontroller.adminContact)
adminRouter.route('/contact/delete/:id').delete(authMiddleware, adminMiddleware, authcontroller.adminContactDelete)
adminRouter.route('/services').get(authMiddleware, adminMiddleware, authcontroller.adminServices)
adminRouter.route('/services/:id/edit').patch(authMiddleware, adminMiddleware, authcontroller.adminServicesUpdate)
adminRouter.route('/services/delete/:id').delete(authMiddleware, adminMiddleware, authcontroller.adminServicesDelete)

router.use('/admin', adminRouter)

export {router}
