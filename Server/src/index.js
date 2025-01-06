import { app } from './app.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;



app.listen(PORT, () => {
    console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`);
});
