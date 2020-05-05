export type EndpointRequest = {
    method: string,
    path: string,
    queryParams: any,
    body: any
}

export type EndpointResponse = {
    statusCode: number,
    headers: any,
    body: any
}

export type EndpointDefinition = {
    request: EndpointRequest,
    response: EndpointResponse,
    hash?: string
}

export type Status = {
    serviceRoot: string,
    endpoints: EndpointDefinition[]
}