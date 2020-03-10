import { MockerController } from "./mocker/mocker-controller"
import { ManagementController } from "./management/management-controller"

import { env } from "process"
import { getArgument } from "./utils"

import { createServer } from "./server"
import { ManagementService } from "./management/management-service"
import { MockerService } from "./mocker/mocker-service"

const port = getArgument("port", "8008")
const managementPort = getArgument("managementPort", "8009")
const serviceRoot = getArgument("home", `${env["HOME"]}/mock-service`)

new ManagementController(new ManagementService(serviceRoot))
    .serve(createServer("Management", serviceRoot, managementPort))
    
new MockerController(new MockerService(serviceRoot))
    .serve(createServer("Mock", serviceRoot, port))
