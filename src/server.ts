import express from "express"

export const createServer = (serviceRoot: string, port: string): express.Express => {
    const server = express()

    server.use(express.json())

    server.listen(port, () => {
        console.info(`Server ${serviceRoot} listening in port ${port}`)
    }).on("error", (error) => {
        console.error(`ERROR: Server ${serviceRoot} could not be started in port ${port}`)
        console.error(`Cause: ${error.message}`)
    })

    return server
}