const { createServer } = require("http")
const { URL } = require("url")
const { argv, env } = require("process")

const { Service } = require("./service")
const { StatusService } = require("./status-service")

exports.Controller = class Controller {

    init() {
        const port = this.getArgument("port", 8008)
        const serviceRoot = this.getArgument("home", `${env["HOME"]}/mock-service`)

        this.statusService = new StatusService(serviceRoot)
        this.service = new Service(serviceRoot)

        createServer(async (request, response) => {
            await ({
                "GET": this.get,
                "POST": this.post
            }[request.method] || (() => { })).apply(this, [request, response])

            console.info(`${request.method} ${request.url} ${response.statusCode}`)
            if (response.statusCode === 500) {
                console.error(response.statusMessage)
            }

            response.end()
        }).listen(port, () => {
            console.info(`Service ${serviceRoot} listening in port ${port}`)
        }).on("error", (error) => {
            console.error(`ERROR: Service ${serviceRoot} could not be started in port ${port}`)
            console.error(`Cause: ${error.message}`)
        })

    }

    get(request, response) {
        try {
            const reqUrl = this.getRequestURL(request)

            response.setHeader("Content-Type", "application/json")

            if (reqUrl.pathname === "/") {
                response.write(JSON.stringify(this.statusService.getStatus()))
            } else {
                response.write(this.service.getResponse(reqUrl))
            }

            response.statusCode = 200
        } catch (error) {
            if (error.code === "ENOENT") {
                response.statusCode = 404
            } else {
                response.statusCode = 500
                response.statusMessage = error
            }
        }
    }

    async post(request, response) {
        try {
            const reqUrl = this.getRequestURL(request)
            const data = await this.getBody(request)

            this.service.writeData(reqUrl, data)

            response.setHeader("Location", reqUrl.href)
            response.statusCode = 201
        } catch (error) {
            response.statusCode = 500
            response.statusMessage = error.message
        }
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

