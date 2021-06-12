import express from 'express'

const app = express()
app.use(express.json())

const server = app.listen(3333,()=>{
    console.log("Servidor ouvindo na porta 3333")
})

function closeServer(): void {
    server.close();
}

export { server, closeServer }