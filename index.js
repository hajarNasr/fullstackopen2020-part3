const { response, request } = require("express");
const express = require("express");
const app = express();
app.use(express.json());

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

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
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
  return person ? true : false;
};

app.post("/api/persons/", (request, response) => {
  const newPreson = request.body;
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
    persons = { ...persons, newPreson };
    response.json(newPreson);
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
