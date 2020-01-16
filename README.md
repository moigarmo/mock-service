# Mock JSON service


Mocks a service that responds with stored json files the matched requests.

Currently two http methods are supported:

**POST**: saves the body as a json file in a directory defined by the request path

**GET**: returns the contents of the json file that matches the request path

Unsupported methods will return 200

## Installation

**Requires nodejs v10.18.1 or higher**

    cd mock-service && npm install -g

## Execute

    mock-service (arg=val)*

- port: port number (default 8008)
- home: service home folder, the root for all service requests (default $HOME/mock-service)
- silent: If true no information is displayed about requests (default false)

**Example**: mock-service port=8081 home=../my-service silent=true

## Data structure

The request path is replicated in disk as a directory tree, files inside the last
folder being the json responses.

Response files names are a hash value obtained of the query search value of the request, or the word "default" if the request has no search part.

A get method does:

* If a get request contains no search query, the default file is served as response.
* If the request has a search query, a file named as the search query (hashed) is served.
* If no match is found 404 is returned.

## Status endpoint

GET request to the root of the service returns the status of the mock service, a json object containing all endpoints defined and where the response file is.

## Examples

**Post default**

    curl 'http://localhost:8008/services/myservice/people/123' -d '{ "prop" : "val" }'


_Creates a file with name "default" hashed with content { "prop" : "val" } in directory $home/services/myservice/people/123_

**Post with specific search params**

    curl 'http://localhost:8008/services/myservice/people/123?name=jua&age=23' -d '{ "prop" : "val" }'


_Creates a file with name "?name=jua&age=23" hashed, with extension .response and content { "prop" : "val" } in directory $home/services/myservice/people/123_

_It also creates a file with the same name and extension .search with contents the search query, used to build the status endpoint result_


**Get default**

    curl 'http://localhost:8008/services/myservice/people/123'


_returns the contents of the "default" hash .response file in directory $home/services/myservice/people/123 or 404 if not found_

**Post with specific search params**

    curl 'http://localhost:8008/services/myservice/people/123?name=jua&age=23' -d '{ "prop" : "val" }'


_returns the contents "?name=jua\\&age=23" hash .response file in directory $home/services/myservice/people/123 or 404 if not found__

**Get service status**

    curl 'http://localhost:8008/'

_Returns_

    {
    "serviceRoot": "/home/username/mock-service",
    "endpoints": [
        {
            "href": "http://localhost:8008/services/myservice/people/123/",
            "response": "/services/myservice/people/123/37a8eec1ce19687d132fe29051dca629d164e2c4958ba141d5f4133a33f0688f.response"
        },
        {
            "href": "http://localhost:8008/services/myservice/people/123/?name=jua&age=23",
            "response": "/services/myservice/people/123/884933714e6cb27c32a39e9f1f286a43d76147d5bebf5388e797058552545786.response"
        }
    ]
}




