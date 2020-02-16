import { createHash } from "crypto"
import { argv } from "process"
import { EndpointRequest } from "./types"
import { Request } from "express"

const stringify = (o: any): string => {
    const str = JSON.stringify(o)    
    return str && str.length > 2 ? str : ""
}

const getRequestHash = (request: EndpointRequest): string => {
    const requestString = `${request.method}${request.path}${request.queryParams || ""}${stringify(request.body)}`

    console.debug(`Hasing request ${requestString}`)

    return createHash("sha256").update(requestString).digest("hex")
}

const getRequestData = async (request: Request): Promise<any> => {
    return new Promise(resolve => {
        const data: any = [];
        request.on("data", chunk => data.push(chunk))
        request.on("end", () => resolve(JSON.parse(Buffer.concat(data).toString())))
    })
}

const getArgument = (name: string, def: string): string => {
    return (argv.find(arg => arg.startsWith(`${name}=`)) || `${name}=${def}`).split("=")[1]
}

export { getRequestHash, getRequestData, getArgument }