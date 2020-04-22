### Backend for TODO React App

#### How to run project locally


- Prerequisites
    - Make sure you have `npm` and `node` installed on your computer
    - Make sure you have MongoDB installed locally or have [Docker](https://www.docker.com/get-started) installed (preferred)

_This guide will provide steps how to run MongoDb using Docker_

- Checkout project locally and navigate to the folder with project
- Install all required dependencies

```bash
npm install
```

- Run MongoDb

```
docker-compose -p mern-todo-backend -f stack.yml up
```


- Run project

```bash
node server.js
```



---

- To stop MongoDb Docker stack

```
docker-compose -p mern-todo-backend -f stack.yml down
``` 
