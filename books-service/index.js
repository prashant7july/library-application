var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var handlers = require('./lib/handlers');

const PORT = process.env.PORT || 8080 ;

var server =  http.createServer(function(req, res){ 	
    
    var parsedUrl = url.parse(req.url, true);
    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    //var trimmedPath = path.split('/')[1];

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();
    
    //Get the headers as an object
    var headers = req.headers;

    //Get the payload if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    req.on('end', function(){
        buffer += decoder.end();

        // Choose the handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound ;

        //Construct the data object sent to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };
        
        chosenHandler(data, function(statusCode, payload){

            statusCode = typeof(statusCode) == 'number' ? statusCode : 200 ;

            payload = typeof(payload) == 'object' ? payload : {} ;

            payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log("Returning the response: ", statusCode, payloadString);

        });

    });
});

server.listen(PORT, function(req, res){
    console.log('server listening on port', PORT)
});

// Define the request router
var router = {
    'ping' : handlers.ping,
    'books' : handlers.books
};


// Container for all the helpers
var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};