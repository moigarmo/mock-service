import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from "fs"
import { getRequestHash } from "../utils"
import { Status, EndpointDefinition } from "../types"

export class ManagementService {

    constructor(private serviceRoot: string) {
        if (!existsSync(serviceRoot)) {
            mkdirSync(serviceRoot, { recursive: true })
        }
    }

    getStatus(): Status {
        const status: Status = {
            serviceRoot: this.serviceRoot,
            endpoints: []
        }
        this.getFilePaths().forEach(({ requestPath, responsePath }) => {
            status.endpoints.push({
                hash: requestPath.replace(/\/|request/g, ""),
                request: JSON.parse(readFileSync(`${this.serviceRoot}${requestPath}`).toString()),
                response: JSON.parse(readFileSync(`${this.serviceRoot}${responsePath}`).toString())
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

    saveEndpoint(definition: EndpointDefinition) {
        const dir = `${this.serviceRoot}/${getRequestHash(definition.request)}`

        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true })
        }

        writeFileSync(`${dir}/request`, JSON.stringify(definition.request))
        writeFileSync(`${dir}/response`, JSON.stringify(definition.response))
    }


}