const fs = require("fs")
const url = require("url")

module.exports.Service = class Service {
    constructor(fileResolver, statusService) {
        this.fileResolver = fileResolver
        this.statusService = statusService
    }

    async serve(request, response) {
        await ({ "GET": this.get, "POST": this.post }[request.method] || (() => { })).apply(this, [request, response])
    }

    get(request, response) {
        try {
            const reqUrl = this.getRequestURL(request)

            response.setHeader("Content-Type", "application/json")

            if (reqUrl.pathname === "/") {
                response.write(JSON.stringify(this.statusService.getStatus(request)))
            } else {
                response.write(fs.readFileSync(this.fileResolver.getResponseFilePath(reqUrl)).toString())
            }

            response.statusCode = 200
        } catch (error) {
            response.statusCode = 404
            response.statusMessage = error
        }
    }

    async post(request, response) {
        try {
            const reqUrl = this.getRequestURL(request)
            const data = await this.getBody(request)

            this.writeData(reqUrl, data)

            response.setHeader("Location", reqUrl.href)
            response.statusCode = 201
        } catch (error) {
            response.statusCode = 500
            response.statusMessage = error
        }
    }

    async getBody(request) {
        return new Promise(resolve => {
            const data = [];
            request.on("data", chunk => data.push(chunk))
            request.on("end", () => resolve(Buffer.concat(data).toString()))
        })
    }

    writeData(reqUrl, data) {
        fs.mkdirSync(this.fileResolver.getFileDir(reqUrl), { recursive: true })
        fs.writeFileSync(this.fileResolver.getResponseFilePath(reqUrl), data)
        fs.writeFileSync(this.fileResolver.getSearchFilePath(reqUrl), reqUrl.search)
    }

    getRequestURL(request) {
        return new url.URL(request.url, `http://${request.headers.host}`)
    }
}