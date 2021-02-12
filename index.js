const { response, request } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

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
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123468",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "040-123468",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "040-123468",
  },
  {
    id: 4,
    name: "Marry Poppendick",
    number: "040-123468",
  },
];

app.use(express.static("build"));

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  console.log(request.path);
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p> <p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

const isUnique = (name) => {
  const person = persons.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
  return person ? false : true;
};

app.post("/api/persons/", (request, response) => {
  let newPreson = request.body;
  newPreson = { id: Math.floor(Math.random() * 1000), ...newPreson };

  if (!newPreson.name || !newPreson.number) {
    return response.status(400).json({
      error: "Missing name or number",
    });
  }
  if (!isUnique(newPreson.name)) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  } else {
    persons = [...persons, newPreson];
    response.json(newPreson);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
