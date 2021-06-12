import express from 'express';
import mongoose from 'mongoose';
import user from './services/user.service';


const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || '3333';
app.use(express.json());

mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

app.use('/user', user);

const server = app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`);
})

function closeServer(): void {
    server.close();
}

export { server, closeServer }