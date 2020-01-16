const file = require("file")

class StatusService {

    constructor(serviceRoot, fileResolver) {
        this.serviceRoot = serviceRoot
        this.fileResolver = fileResolver
    }

    getStatus(request) {
        const status = {
            serviceRoot: this.serviceRoot,
            endpoints: []
        }
        this.getFilePaths(request).forEach(path => {
            status.endpoints.push({
                href: `http://${request.headers.host}${this.fileResolver.getFileHrefPath(path)}`,
                response: path
            })
        })

        return status
    }

    getFilePaths() {
        const paths = []

        file.walkSync(this.serviceRoot, (dirPath, childDirs, files) => {
            files.filter(name => name.endsWith(".response"))
                 .forEach(name => paths.push(`${dirPath.replace(this.serviceRoot, "")}/${name}`))
        })

        return paths
    }

}

module.exports.StatusService = StatusService