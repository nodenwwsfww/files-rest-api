import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index';
import signInRouter from './routes/signin';
import fileRouter from './routes/file';

const app = express();

app.use(cors()); // To allow from any domain
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/signin', signInRouter);
app.use('/file', fileRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// globally catching unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at promise '+promise+' reason ', reason);
    console.log('Server is still running...\n');
});

// globally catching unhandled exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception is thrown with ',error+'\n');
    process.exit();
});
export default app;
