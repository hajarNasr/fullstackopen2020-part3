const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");
const Person = require("./models/person");

const app = express();
app.use(express.json());
app.use(cors());

morgan.token("bodyContent", (request, response) => request.body);
morgan.token("path", (request, response) => request.path);

app.use(
  morgan(
    ":method :path :status - :response-time ms :res[content-length] :bodyContent"
  )
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((res) => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.static("build"));

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${
        persons.length
      } people</p> <p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((err) => {
      response.status(404).end();
    });
});

app.put("/api/persons/:id", (request, response) => {
  Person.findByIdAndUpdate(request.params.id, { number: request.body.number })
    .then((person) => {
      response.json(person);
    })
    .catch((err) => {
      response.status(404).end();
    });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .exec()
    .then((res) => {
      Person.find({}).then((persons) => {
        response.json(persons);
      });
    })
    .catch((err) => {
      response.status(204).end();
    });
});

app.post("/api/persons/", (request, response) => {
  let newPreson = new Person(request.body);

  if (!newPreson.name || !newPreson.number) {
    return response.status(400).json({
      error: "Missing name or number",
    });
  }
  Person.find({ name: newPreson.name })
    .then((person) => {
      if (person.length) {
        return response.status(400).json({
          error: "Name must be unique",
        });
      } else {
        newPreson
          .save()
          .then((person) => {
            response.json(person);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
