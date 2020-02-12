const { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } = require("fs")
const { createHash } = require("crypto")

exports.ManagementService = class ManagementService {

    constructor(serviceRoot) {
        this.serviceRoot = serviceRoot
        if (!existsSync(serviceRoot)) {
            mkdirSync(serviceRoot, { recursive: true })
        }
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

    writeData(reqUrl, data) {
        const dir = `${this.serviceRoot}/${this.getRequestHrefHash(reqUrl)}`

        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true })
        }

        writeFileSync(`${dir}/request`, reqUrl.href)
        writeFileSync(`${dir}/response`, data)
    }

    getRequestHrefHash(url) {
        return createHash("sha256")
                     .update(url.href)
                     .digest("hex")
    }

}