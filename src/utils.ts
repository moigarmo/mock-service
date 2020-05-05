import { createHash } from "crypto"
import { argv } from "process"
import { EndpointRequest } from "./types"

const stringify = require("fast-json-stable-stringify")

const stringifyNonEmptyObject = (o: any): string => {
    if (!o) return ""

    const str = stringify(o)    
    return str && str.length > 2 ? str : ""
}

const getRequestHash = (request: EndpointRequest): string => {
    const requestString = `${request.method}${request.path}${stringifyNonEmptyObject(request.queryParams)}${stringifyNonEmptyObject(request.body)}`

    const hash = createHash("sha256").update(requestString).digest("hex")

    console.debug(`Hasing request ${requestString} to ${hash}`)

    return hash
}

const getArgument = (name: string, def: string): string => {
    return (argv.find(arg => arg.startsWith(`${name}=`)) || `${name}=${def}`).split("=")[1]
}

export { getRequestHash, getArgument }