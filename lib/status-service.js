const { readFileSync, readdirSync } = require("fs")

exports.StatusService = class StatusService {

    constructor(serviceRoot) {
        this.serviceRoot = serviceRoot
    }

    getStatus(request) {
        const status = {
            serviceRoot: this.serviceRoot,
            endpoints: []
        }
        this.getFilePaths(request).forEach(({ requestPath, responsePath }) => {
            status.endpoints.push({
                request: readFileSync(`${this.serviceRoot}${requestPath}`).toString(),
                response: responsePath
            })
        })

        return status
    }

    getFilePaths() {
        return readdirSync(this.serviceRoot)
                 .map(dir => ({ dir: dir, files: readdirSync(`${this.serviceRoot}/${dir}`) }))
                 .map(({dir, files}) => ({
                     requestPath: `/${dir}/${files.find(name => name === "request")}`,
                     responsePath: `/${dir}/${files.find(name => name === "response")}`
                    }))
    }

}