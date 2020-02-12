const express = require("express")
const { URL } = require("url")
const { argv, env } = require("process")

const { ManagementService } = require("./management-service")

exports.ManagementController = class ManagementController {

    init() {
        const port = this.getArgument("managementPort", 8009)
        const serviceRoot = this.getArgument("home", `${env["HOME"]}/mock-service`)

        this.managementService = new ManagementService(serviceRoot)

        console.info(`Starting Management Service`)

        const server = express()

        server.get('/status', (req, res) => this.getStatus(req, res))
        server.post('/*', (req, res) => this.createEndpoint(req, res))

        server.listen(port, () => {
            console.info(`Management Service ${serviceRoot} listening in port ${port}`)
        }).on("error", (error) => {
            console.error(`ERROR: Management Service ${serviceRoot} could not be started in port ${port}`)
            console.error(`Cause: ${error.message}`)
        })
    }

    getStatus(request, response) {
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

    async createEndpoint(request, response) {
        try {
            const reqUrl = this.getRequestURL(request)
            const data = await this.getBody(request)

            this.managementService.writeData(reqUrl, data)

            response.setHeader("Location", reqUrl.href)
            response.statusCode = 201
        } catch (error) {
            response.statusCode = 500
            response.statusMessage = error.message
        }
        response.end()
    }

    getRequestURL(request) {
        return new URL(request.url, `http://${request.headers.host}`)
    }

    async getBody(request) {
        return new Promise(resolve => {
            const data = [];
            request.on("data", chunk => data.push(chunk))
            request.on("end", () => resolve(Buffer.concat(data).toString()))
        })
    }

    getArgument(name, def) {
        return (argv.find(arg => arg.startsWith(`${name}=`)) || `${name}=${def}`).split("=")[1]
    }
}

