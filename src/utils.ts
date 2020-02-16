import { createHash } from "crypto"
import { argv } from "process"
import { EndpointRequest } from "./types"

const stringify = (o: any): string => {
    if (!o) return ""

    const str = JSON.stringify(o)    
    return str && str.length > 2 ? str : ""
}

const getRequestHash = (request: EndpointRequest): string => {
    const requestString = `${request.method}${request.path}${stringify(request.queryParams)}${stringify(request.body)}`

    console.debug(`Hasing request ${requestString}`)

    return createHash("sha256").update(requestString).digest("hex")
}

const getArgument = (name: string, def: string): string => {
    return (argv.find(arg => arg.startsWith(`${name}=`)) || `${name}=${def}`).split("=")[1]
}

export { getRequestHash, getArgument }