const express = require("express");
const app = express();

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

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
