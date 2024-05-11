import { Router } from 'express'
import {body, check, oneOf, validationResult} from 'express-validator'
import {createProduct, deleteProduct, getOneProduct, getProducts, updateProduct} from "./handlers/product";
import {handleInputErrors} from "./modules/middleware";
import {createUpdate, deleteUpdate, getOneUpdate, getUpdates, updateUpdate} from "./handlers/update";

const router = Router()

/*
* Product
* */
router.get('/product', getProducts)
router.get('/product/:id', getOneProduct)

router.put('/product/:id', body('name').exists().isString(), handleInputErrors, updateProduct)

router.post('/product', body('name').isString(), handleInputErrors, createProduct)

router.delete('/product/:id', deleteProduct)

/*
* Update
* */
router.get('/update', getUpdates)
router.get('/update/:id', getOneUpdate)
router.put('/update/:id',
    oneOf([
        body('title').exists().isString(),
        body('body').exists().isString(),
        body('status').exists().isString().isIn(['IN_PROGRESS', 'SHIPPED', 'DEPRECATED']),
        body('version').exists().isString()
    ]),
    handleInputErrors,
    updateUpdate
)
router.post('/update',
    body('title').exists(),
    body('body').exists().isString(),
    body('status').optional().isIn(['IN_PROGRESS', 'SHIPPED', 'DEPRECATED']),
    body('version').optional(),
    handleInputErrors,
    createUpdate
)
router.delete('/update/:id', deleteUpdate)

/*
* Update Point
* */
router.get('/updatepoint', () => {})
router.get('/updatepoint/:id', () => {})
router.put('/updatepoint/:id',
    oneOf([
        body('name').exists().isString(),
        body('description').exists().isString(),
    ]),
    handleInputErrors,
    () => {})
router.post('/updatepoint',
    body('name').exists().isString(),
    body('description').exists().isString(),
    body('productId').exists().isString(),
    handleInputErrors,
    () => {})
router.delete('/updatepoint/:id', () => {})

router.use((err, req, res, next) => {
    if (err.type === 'auth') {
        res.status(401).json({message: 'Not authorized'})
    } else if (err.type === 'input') {
        res.status(400).json({message: 'Invalid input'})
    } else {
        res.status(500).json({message: 'There was an error'})
    }
})

export default router