// @ts-check
import express from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import api from './api';
import errorHandler from './middleware/errorHandler';

const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

// Route handlers
app.use('/api', api);
// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
