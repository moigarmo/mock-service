# Mock JSON service

Mocks a service that responds with stored json files the matched requests.

Currently two http methods are supported:

**POST**: saves the body as a json file in a directory defined by the request path

**GET**: returns the contents of the json file that matches the request path


## Execute
 **Requires nodejs v10.18.1 or higher**

    node ./index.js (arg=val)*

- port: port number (default 8009)
- home: service home folder, the root for all service requests (default $HOME/mock-service)
- silent: If true no information is displayed about requests (default false)

**Example**: nodejs ./indexjs port=8081 home=../my-service silent=true

## File structure

The request path is replicated in disk as a directory tree, files inside the last folder beign json responses.

* If a get request contains no search query, the default file is served as response.
* If the request has a search query, a file named as the search query is served.
* If no match is found 404 is returned.

Post method creates the resources in the same way get method expects to find them

#### Examples

**Post default**

    curl http://localhost:8009/services/myservice/people/123 -d '{ "prop" : "val" }'


_Creates a file named "default" with content { "prop" : "val" } in directory $home/services/myservice/people/123_

**Post with specific search params**

    curl http://localhost:8009/services/myservice/people/123?name=jua&age=23 -d '{ "prop" : "val" }'


_Creates a file named "?name=jua\\&age=23" with content { "prop" : "val" } in directory $home/services/myservice/people/123_


**Get default**

    curl http://localhost:8009/services/myservice/people/123


_returns the contents of file named "default" in directory $home/services/myservice/people/123 or 404 if not found_

**Post with specific search params**

    curl http://localhost:8009/services/myservice/people/123?name=jua&age=23 -d '{ "prop" : "val" }'


_returns the contents of file named "?name=jua\\&age=23" in directory $home/services/myservice/people/123 or 404 if not found__





