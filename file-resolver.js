const crypto = require("crypto")
const fs = require("fs")

class FileResolver {
    constructor(serviceRoot) {
        this.serviceRoot = serviceRoot
    }

    getFileName(url) {
        return crypto.createHash("sha256")
                     .update(url.search || "default")
                     .digest("hex")
    }

    getFileHrefPath(path) {
        const searchFilePath = `${this.serviceRoot}${path.replace(/response$/, "search")}`
        const pathParts = path.split("/")
        pathParts.pop()

        if (fs.existsSync(searchFilePath)) {
            pathParts.push(fs.readFileSync(searchFilePath).toString())
        }

        return pathParts.join("/")
    }

    getFileDir(url) {
        return `${this.serviceRoot}${url.pathname.replace(url.search || "default", "")}`
    }

    getResponseFilePath(url) {
        return `${this.getFileDir(url)}/${this.getFileName(url)}.response`
    }

    getSearchFilePath(url) {
        return `${this.getFileDir(url)}/${this.getFileName(url)}.search`
    }
}

module.exports.FileResolver = FileResolver