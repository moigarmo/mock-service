# Mock JSON service


Mocks a service that responds with stored json files the matched requests.

Currently two http methods are supported:

**POST**: saves the body as a json file in a directory defined by the request path

**GET**: returns the contents of the json file that matches the request path

Unsupported methods will return 200 and will have no effect

## Installation

**Requires nodejs v10.18.1 or higher**

    cd mock-service && npm install -g

## Execute

    mock-service (arg=val)*

- port: port number (default 8008)
- home: service home folder, the root for all service requests (default $HOME/mock-service)

**Example**: mock-service port=8081 home=../my-service

## Data structure

When a POST is handled, the request path is hashed and that hashed is used to create a directory in the service home folder.
Inside each request directory two files are created:

* request: contains the request path, used by the status endpoint
* response: contains the body of the request


```
curl 'http://localhost:8008/services/myservice/people/123' -d '{ "prop" : "val" }'
```

_Creates a response file with the body in ${home}/de2bbcebe4b22d766d6e1f814d6a46705fb0da069f81cd256363b1d18de4b3b5/response,
and a request file with the request path in ${home}/de2bbcebe4b22d766d6e1f814d6a46705fb0da069f81cd256363b1d18de4b3b5/request_


When a GET is handled, the request path is hashed and a matching folder is search, if found,
the contents of the response file is returned, otherwise a 404 error is returned.

## Status endpoint

GET request to the root of the service returns the status of the mock service, a json object containing all endpoints defined and where the response file is.


**Get service status**

    curl 'http://localhost:8008/'

_Returns_

    {
        "serviceRoot": "/home/moi/mock-service",
        "endpoints": [
            {
            "request": "http://localhost:8008/services/myservice/people?name=arthur&last_name=dent",
            "response": "/2360db3db92b8045e63f01fbff4f761a69faf458bfcbaef454c5f840a8f9f901/response"
            },
            {
            "request": "http://localhost:8008/services/myservice/people/123",
            "response": "/de2bbcebe4b22d766d6e1f814d6a46705fb0da069f81cd256363b1d18de4b3b5/response"
            }
        ]
    }






