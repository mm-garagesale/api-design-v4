import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import {protect} from "./modules/auth";
import {createNewUser, signin} from "./handlers/user";
import {body} from "express-validator";
import {handleInputErrors} from "./modules/middleware";

const app = express();

const customLogger = (message) => (req, res, next) => {
    console.log('Hello from custom', message)
    next()
}

app.use(cors())
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(customLogger('custom logger'))

// app.use((req, res, next) => {
//     //req.shhhh_secret = 'doggy';
//     //res.status(401)
//     //res.send('Nope')
//     next()
// });

app.get('/', (req, res, next) => {

    res.json({message: 'hello'})

    // setTimeout(() => {
    //     next(new Error('hello'))
    // }, 1)

    // res.status(200);
    // res.json({message: 'hello'});
    // res.end();
})

app.use('/api', protect, router)
app.post('/user',
    body('username')
        .exists().withMessage('username is required')
        .isString().withMessage('username must be a string')
        .isLength({ min: 6, max: 16 }).withMessage('username must have beetween 6 and 16 characters long'),
    body('password')
        .exists().withMessage('password is required')
        .isString().withMessage('username must be a string')
        .isLength({ min: 5, max: 16 }).withMessage('password must have beetween 5 and 16 characters long'),
    handleInputErrors,
    createNewUser
)
app.post('/signin', signin)

app.use((err, req, res, next) => {
    if (err.type === 'auth') {
        res.status(401).json({message: 'Not authorized'})
    } else if (err.type === 'input') {
        res.status(400).json({message: 'Invalid input'})
    } else {
        res.status(500).json({message: 'There was an error'})
    }
})

export default app;