# Mock JSON service


Mocks a service that responds with stored json files the matched requests.

## Installation

**Requires nodejs v10.18.1 or higher**

    cd mock-service && npm install -g

## Execute

    mock-service (arg=val)*

- port: port number (default 8008)
- managementPort: management service port number (default 8009)
- home: service home folder, the root for all service requests (default $HOME/mock-service)

**Example**: mock-service port=8081 managementPort=9000 home=/somepath/my-service

Starts a service at port 8081 and returns endpoints defined in /somepath/my-service folder.
Starts a management service at port 9000 that can create endpoints in /somepath/my-service folder.

## Management service API

The management service handles endpoints definitions and stores them as plain text files in the home service folder.

A directory is created with a hashed from each endpoint definition, inside each directory two files are stored with the request and the expected response.

> POST /endpoints

Creates an endpoint definition. The body of the request is defined as follows:

```
{
    "request": {
        "method": http method,
        "path": complete url path,
        "queryParams": {
            query params definition
        },
        "body": {
        	body definition
        }
    },
    "response": {
        "statusCode": expected status code,
        "headers": {
            expected headers definition
        },
        "body": {
            expected body definition
        }
    }
}
```

> GET /endpoints

Returns the list of defined endpoints registered for this service.

**Request headers are not considered in the endpoint definitions as all request information is hashed and used to match requests and headers can vary from calls through different clients and might cause that expected resulst don't match**







