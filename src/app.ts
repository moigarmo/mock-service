import { Controller } from "./service/controller"
import { ManagementController } from "./management/management-controller"

import { env } from "process"
import { getArgument } from "./utils"

import { createServer } from "./server"
import { ManagementService } from "./management/management-service"
import { Service } from "./service/service"

const port = getArgument("port", "8008")
const managementPort = getArgument("managementPort", "8009")
const serviceRoot = getArgument("home", `${env["HOME"]}/mock-service`)

new ManagementController(new ManagementService(serviceRoot))
    .serve(createServer(serviceRoot, managementPort))
    
new Controller(new Service(serviceRoot))
    .serve(createServer(serviceRoot, port))
