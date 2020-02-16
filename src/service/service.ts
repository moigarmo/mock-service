import { readFileSync } from "fs"
import { getRequestHash } from "../utils"
import { EndpointRequest, EndpointResponse } from "../types"

export class Service {
    
    constructor(private serviceRoot: string) {
    }

    getResponse(request: EndpointRequest): EndpointResponse {
        const responseContents = readFileSync(`${this.serviceRoot}/${getRequestHash(request)}/response`).toString()
    
        return JSON.parse(responseContents);
    }
}