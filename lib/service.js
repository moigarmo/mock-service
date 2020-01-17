const { readFileSync, existsSync, mkdirSync, writeFileSync } = require("fs")
const { createHash } = require("crypto")

exports.Service = class Service {
    constructor(serviceRoot) {
        this.serviceRoot = serviceRoot
    }

    getResponse(reqUrl) {
        return readFileSync(`${this.serviceRoot}/${this.getRequestHrefHash(reqUrl)}/response`).toString()
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