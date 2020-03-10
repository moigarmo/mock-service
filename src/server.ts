import express from "express"

export const createServer = (name: string, serviceRoot: string, port: string): express.Express => {
    const server = express()

    server.use(express.json())

    server.listen(port, () => {
        console.info(`${name} server ${serviceRoot} listening in port ${port}`)
    }).on("error", (error) => {
        console.error(`ERROR: ${name} server ${serviceRoot} could not be started in port ${port}`)
        console.error(`Cause: ${error.message}`)
    })

    return server
}