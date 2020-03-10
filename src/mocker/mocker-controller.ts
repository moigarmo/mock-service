import express, { Request, Response } from "express"

import { MockerService } from "./mocker-service"

export class MockerController {

    constructor(private service: MockerService) {

    }

    serve(server: express.Express) {
        server.all('/*', (req, res) => {
            this.processRequest(req, res)
        })
    }

    async processRequest(request: Request, response: Response) {
        try {
            const body = request.body
            const queryParams = request.query
            const method = request.method
            const path = request.path

            const endpointResponse = this.service.getResponse({
                method, path, queryParams, body
            })

            if (endpointResponse.headers) {
                Object.keys(endpointResponse.headers).forEach(key => response.setHeader(key, endpointResponse.headers[key]))
            }

            if (endpointResponse.body) {
                response.write(JSON.stringify(endpointResponse.body))
            }

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

