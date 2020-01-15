const fs = require("fs")
const url = require("url")

module.exports.Service = class Service {
    constructor(serviceRoot) {
        this.serviceRoot = serviceRoot
    }

    async serve(request, response) {
        await ({ "GET": this.get, "POST": this.post }[request.method] || (() => { })).apply(this, [request, response])
    }

    get(request, response) {
        try {
            response.setHeader("Content-Type", "application/json")
            response.write(fs.readFileSync(this.getFilePath(this.getRequestURL(request))).toString())
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

            fs.mkdirSync(this.getFileDir(reqUrl), { recursive: true })
            fs.writeFileSync(this.getFilePath(reqUrl), data)
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

    getFileDir(url) {
        return `${this.serviceRoot}${url.pathname}`
    }

    getFileName(url) {
        return (url.search || "default").replace(/&/g, "\\&");
    }

    getFilePath(url) {
        return `${this.getFileDir(url)}/${this.getFileName(url)}`
    }

    getRequestURL(request) {
        return new url.URL(request.url, `http://${request.headers.host}`)
    }
}