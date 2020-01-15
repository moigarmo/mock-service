const http = require("http")
const process = require("process")
const { Service } = require("./service")

function getArgument(name, def) {
    return (process.argv.find(arg => arg.startsWith(`${name}=`)) || `${name}=${def}`).split("=")[1]
}

const port = getArgument("port", 8008)
const serviceRoot = getArgument("home", `${process.env["HOME"]}/mock-service`)
const silent = getArgument("silent", false) === "true"

const service = new Service(serviceRoot)

console.info(`Service ${serviceRoot} listening in port ${port}`)

http.createServer(async (request, response) => {

    await service.serve(request, response)

    if (!silent) {
        console.info(`${request.method} ${request.url} ${response.statusCode}`)
        if (![200, 201].includes(response.statusCode)) {
            console.error(response.statusMessage)
        }
    }

    response.end()
}).listen(port)

