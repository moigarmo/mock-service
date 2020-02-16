import express, { Request, Response } from "express"

import { ManagementService } from "./management-service"
import { EndpointDefinition } from "../types";

export class ManagementController {

    constructor(private managementService: ManagementService) {

    }

    serve(server: express.Express) {
        server.get('/status', (req, res) => this.getStatus(res))
        server.post('/endpoint', (req, res) => this.createEndpoint(req, res))
    }

    getStatus(response: Response) {
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
            const definition: EndpointDefinition = request.body

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

