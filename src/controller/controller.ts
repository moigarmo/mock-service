import express, { Request, Response } from "express"
import { env } from "process"
import { getRequestData, getArgument } from "../utils"

import { Service } from "../service/service"

export class Controller {

    private service: Service

    constructor() {
        const port = getArgument("port", "8008")
        const serviceRoot = getArgument("home", `${env["HOME"]}/mock-service`)

        this.service = new Service(serviceRoot)

        console.info('Starting Mock Service')

        const server = express()

        server.all('/*', (req, res) => {
            this.processRequest(req, res)
        })

        server.listen(port, () => {
            console.info(`Mock Service ${serviceRoot} listening in port ${port}`)
        }).on("error", (error) => {
            console.error(`ERROR: Mock Service ${serviceRoot} could not be started in port ${port}`)
            console.error(`Cause: ${error.message}`)
        })

    }

    async processRequest(request: Request, response: Response) {
        try {
            const body = await getRequestData(request)
            const queryParams = request.query
            const method = request.method
            const path = request.path

            const endpointResponse = this.service.getResponse({
                method, path, queryParams, body
            })

            Object.keys(endpointResponse.headers).forEach(key => response.setHeader(key, endpointResponse.headers[key]))
            
            response.write(endpointResponse.body)

            response.statusCode = endpointResponse.statusCode

        } catch (error) {
            if (error.code === "ENOENT") {
                response.statusCode = 404
            } else {
                response.statusCode = 500
                response.statusMessage = error
                console.error(error)
            }
        }

        console.info(`${request.method} ${request.url} ${response.statusCode}`)
        response.end()
    } 
}

