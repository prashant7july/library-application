# Restful CRUD API for a Library application
Build a Restful CRUD API for a Library application using Node.js with storing the data in json formate to create books service. So this application is known as stateful Application because it uses filesystem use.

`Note: ISBN is unique with length 10, not used id or uuid for primary key`

## API Features
```
1. (C)reate a new Book
2. (R)ead existing Books
3. (U)pdate an existing Book
4. (D)elete an existing Book
```

## API Endpoint List
Thumb Rule: Don't use verb just use plural

### 1. Create book
Endpoint: POST /books

Payload:
```
{
	"author": "Jawaharlal Nehru",
	"title": "The Discovery of India",
	"isbn": "0191118866",
	"releaseDate": "1946-11-14"
}
```

Response:
```
{}
```

### 2. Get book by ID
Endpoint: GET /books/:id OR /books?isbn=:isbn

Payload: none

Response:
```
{
    "author": "Jawaharlal Nehru",
    "title": "The Discovery of India",
    "isbn": "0191118866",
    "releaseDate": "1946-11-14"
}
```

### 3. Update book
Endpoint: PUT /books/:id OR /books 

Payload:
```
{
	"author": "Pandit Javal Lal Nehru",
	"title": "The Discovery of India",
	"isbn": "0191118866",
	"releaseDate": "1946-11-14"
}
```

Response:
```
{}
```

### 4. Delete book
Endpoint: DELETE /books/:id OR /books?isbn=:isbn

Payload: none

Response:
```
{}
```

## Header Value
* 2XX - Success
* 4XX - Client Side Error
* 5XX - Server Side Error

## How to create API documented (OpenAPI) with docker ?
Execute swagger-editor docker run command `docker run -p 8090:8080 swaggerapi/swagger-editor` and Check in Address Bar `http://localhost:8090/` and create `swagger.yml` file accordingly.

Then use `swagger.yml` file to any tech stake team and check with docker run command `docker run --rm -p 9002:8080 -v $(pwd)/swagger.yml:/swagger.yaml -e SWAGGER_JSON=/swagger.yaml swaggerapi/swagger-ui`

# Build(Docker)/Ship/Deploy(Kubernetes)

## Build

You can build the image by `docker build . -t books:1.0.0`

## Run
We are running a container with the interactive and detached mode and also exposing the port 8080 to the outside world.

You can build the image by `docker run --name=books -d -p 8080:8080 books:0.0.1`

## OR

Build image if Permission denied `chmod +x build.sh`:
```
$ ./build.sh
```
## Accessing the Book after Docker build
If you are running the store locally via *docker build and docker run* then, the book is available on localhost port 8080 [http://localhost:8088](http://localhost:8088/)

## Deploy on Kubernetes - Horizontal Scaling for Production when load increases 

Horizontal scaling means that you scale by adding more machines into your pool of resources whereas Vertical scaling means that you scale by adding more power (CPU, RAM) to an existing machine

You can run Kubernetes locally using [minikube](https://github.com/kubernetes/minikube) or on one of the many cloud providers.

You can deploy on kubernetes using the manifests present in `kubernetes` folder.

## Accessing the Store
If you are running the library on Kubernetes via minikube then, find the IP address of Minikube and the Node Port of the web service.

```
$ ./deploy.sh
```

```shell
$ minikube ip
$ kubectl get svc kbook
```