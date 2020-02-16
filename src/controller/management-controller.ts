import express, { Request, Response } from "express"
import { env } from "process"
import { getRequestData, getArgument } from "../utils"

import { ManagementService } from "../service/management-service"
import { EndpointDefinition } from "../types";

export class ManagementController {

    private managementService: ManagementService;

    constructor() {
        const managementPort = getArgument("managementPort", "8009")
        const serviceRoot = getArgument("home", `${env["HOME"]}/mock-service`)

        this.managementService = new ManagementService(serviceRoot)

        console.info(`Starting Management Service`)

        const server = express()

        server.get('/status', (req, res) => this.getStatus(req, res))
        server.post('/endpoint', (req, res) => this.createEndpoint(req, res))

        server.listen(managementPort, () => {
            console.info(`Management Service ${serviceRoot} listening in port ${managementPort}`)
        }).on("error", (error) => {
            console.error(`ERROR: Management Service ${serviceRoot} could not be started in port ${managementPort}`)
            console.error(`Cause: ${error.message}`)
        })
    }

    getStatus(request: Request, response: Response) {
        try {
            response.setHeader("Content-Type", "application/json")

            response.write(JSON.stringify(this.managementService.getStatus()))

            response.statusCode = 200
        } catch (error) {
            response.statusCode = 500
            response.statusMessage = error
        }
        response.end()
    }

    async createEndpoint(request: Request, response: Response) {
        try {
            const definition: EndpointDefinition = await getRequestData(request)

            this.managementService.saveEndpoint(definition)

            response.statusCode = 201
        } catch (error) {
            response.statusCode = 500
            response.statusMessage = error.message
            console.error(error)
        }
        response.end()
    }
}

