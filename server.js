const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    mongoose = require("mongoose"),
    todoRouters = express.Router(),
    PORT = 4000;

let Todo = require('./models/todo');

const hostname = '127.0.0.1';
let user = process.env.MONGO_USER_NAME;
let pass = process.env.MONGO_USER_PASS;
let dbname = "todos";
let connectionString = `mongodb://${user}:${pass}@localhost:27017/${dbname}?authSource=admin`

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false}
);
const connection = mongoose.connection
connection.once('open', function () {
    console.log("MongoDB database established successfully")
})

app.use(cors());
app.use(bodyParser.json());

// I created API on server and then from front end through routes I make request to API
// GET all todos from DB:
// this "/" extension from "http://localhost:4000/todos"
todoRouters.route('/').get(function (req, res) {
    var mongoQuery = {}
    if (typeof req.query.priority !== "undefined") {
        mongoQuery["priority"] = req.query.priority
    }
    // console.log(`get millis: ${(new Date()).getTime()}`)
    res.setHeader('maxAge', 0);
    Todo.find(mongoQuery, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            res.json(data)
        }
    });
});
// GET only one t0do with specific id:
todoRouters.route('/:id').get(function (req, res) {  // req, res - Object
    let id = req.params.id
    Todo.findById(id, function (err, todo) {
        if (err) {
            console.log(err)
        } else {
            res.json(todo)
        }
    });
});

// ADD new t0do in DB:
todoRouters.route('/add').post(function (req, res) {
    let todo = new Todo(req.body)  // retrieve data from req.body
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'})
        })
        .catch(err => {
            res.status(400).send('adding new todo failed')
        });
});
// UPDATE particular t0do:
todoRouters.route('/update/:id').post(function (req, res) {
    console.log(`update - start millis: ${(new Date()).getTime()}`)
    console.log(`updating id: ${req.params.id}`)
    Todo.findById(req.params.id, function (err, todo) {
        if (!todo) {
            res.status(404).send('data is not found')
        } else {
            todo.description = req.body.description;    // update props of t0do object from DB with new value
            todo.priority = req.body.priority;
            todo.responsible = req.body.responsible;
            todo.completed = req.body.completed;

            todo.save().then(todo => {
                console.log(`update - save millis: ${(new Date()).getTime()}`)
                res.json('Todo updated')
            })
                .catch(err => {
                    res.status(400).send('Update is not possible')
                });
        }
    });
});

todoRouters.route('/:id').delete(function (req, res) {
    Todo.findByIdAndRemove({_id: req.params.id}, function (err, todo) {
        if (err) res.json(err);
        else res.json('Successfully removed');
    });
});



app.use('/todos', todoRouters)

app.listen(PORT, function () {
    console.log(`Server running at PORT: ${PORT} \n\n http://localhost:${PORT}`)
})

