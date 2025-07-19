
import express, { Application, Request, Response } from 'express';
import { bookRoutes } from './app/controllers/bookController';
import { borrowRoutes } from './app/controllers/borrowController';

const app: Application = express();
app.use(express.json());


app.use('/api/book', bookRoutes);
app.use('/api/borrow', borrowRoutes);

app.get('/',(req:Request, res:Response) => {
    res.send('Hello, Welcome to Book Library Management API  ');
});

export default app;
