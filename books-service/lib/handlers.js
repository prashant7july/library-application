// Dependencies
var _data = require('./data');

// Define all the handlers
var handlers = {};

// Ping
handlers.ping = function(data,callback){
    callback(200);
};

// Not-Found
handlers.notFound = function(data,callback){
  callback(404);
};

// Books
handlers.books = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._books[data.method](data,callback);
  } else {
    callback(405);
  }
};

// Container for all the books methods
handlers._books  = {};

// Books - post
// Required data: author, title, isbn, releaseDate
// Optional data: none
handlers._books.post = function(data,callback){
  // Check that all required fields are filled out
  var author = typeof(data.payload.author) == 'string' && data.payload.author.trim().length > 0 ? data.payload.author.trim() : false;
  var title = typeof(data.payload.title) == 'string' && data.payload.title.trim().length > 0 ? data.payload.title.trim() : false;
  var isbn = typeof(data.payload.isbn) == 'string' && data.payload.isbn.trim().length == 10 ? data.payload.isbn.trim() : false;
  var releaseDate = typeof(data.payload.releaseDate) == 'string' && data.payload.releaseDate.trim().length > 0 ? data.payload.releaseDate.trim() : false;
  var regEx = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

  if(author && title && isbn && releaseDate.match(regEx)){
    // Make sure the book doesnt already exist
    _data.read('books',isbn,function(err,data){
      if(err){
        
          // Create the book object
          var bookObject = {
            'author' : author,
            'title' : title,
            'isbn' : isbn,
            'releaseDate' : releaseDate
          };

          // Store the book
          _data.create('books',isbn, bookObject, function(err){
            if(!err){
              callback(200);
            } else {
              console.log(err);
              callback(500,{'Error' : 'Could not create the new book'});
            }
          });

      } else {
        // Book alread exists
        callback(400,{'Error' : 'A book with that isbn number already exists'});
      }
    });

  } else {
    callback(400,{'Error' : 'Missing required fields'});
  }
};

// Required data: isbn
// Optional data: none
handlers._books.get = function(data,callback){
  // Check that isbn number is valid
  var isbn = typeof(data.queryStringObject.isbn) == 'string' && data.queryStringObject.isbn.trim().length == 10 ? data.queryStringObject.isbn.trim() : false;  
  if(isbn){
    // Lookup the book
    _data.read('books',isbn,function(err,data){
      if(!err && data){
        callback(200,data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};

// Required data: isbn
// Optional data: author, title, releaseDate (at least one must be specified)
handlers._books.put = function(data,callback){
  // Check for required field
  var isbn = typeof(data.payload.isbn) == 'string' && data.payload.isbn.trim().length == 10 ? data.payload.isbn.trim() : false;

  // Check for optional fields
  var author = typeof(data.payload.author) == 'string' && data.payload.author.trim().length > 0 ? data.payload.author.trim() : false;
  var title = typeof(data.payload.title) == 'string' && data.payload.title.trim().length > 0 ? data.payload.title.trim() : false;
  var releaseDate = typeof(data.payload.releaseDate) == 'string' && data.payload.releaseDate.trim().length > 0 ? data.payload.releaseDate.trim() : false;
  var regEx = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

  // Error if isbn is invalid
  if(isbn){
    // Error if nothing is sent to update
    if(author || title || releaseDate.match(regEx)){
      // Lookup the book
      _data.read('books',isbn,function(err,bookData){
        if(!err && bookData){
          // Update the fields if necessary
          if(author){
            bookData.author = author;
          }
          if(title){
            bookData.title = title;
          }
          if(releaseDate){
            bookData.releaseDate = releaseDate;
          }

          // Store the new updates
          _data.update('books',isbn, bookData, function(err){
            if(!err){
              callback(200);
            } else {
              console.log(err);
              callback(500,{'Error' : 'Could not update the book.'});
            }
          });
        } else {
          callback(400,{'Error' : 'Specified book does not exist.'});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing fields to update.'});
    }
  } else {
    callback(400,{'Error' : 'Missing required field.'});
  }

};

// Required data: isbn
// @TODO Only let an authenticated book delete their object. Dont let them delete update elses.
// @TODO Cleanup (delete) any other data files associated with the book
handlers._books.delete = function(data,callback){
  // Check that isbn number is valid
  var isbn = typeof(data.queryStringObject.isbn) == 'string' && data.queryStringObject.isbn.trim().length == 10 ? data.queryStringObject.isbn.trim() : false;
  if(isbn){
    // Lookup the book
    _data.read('books',isbn,function(err,data){
      if(!err && data){
        _data.delete('books',isbn,function(err){
          if(!err){
            callback(200);
          } else {
            callback(500,{'Error' : 'Could not delete the specified book'});
          }
        });
      } else {
        callback(400,{'Error' : 'Could not find the specified book.'});
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};

// Export the handlers
module.exports = handlers;