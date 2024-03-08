require("dotenv").config();
const url = process.env.MONGODB_URI;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Person = require("./models/person");
const app = express();

mongoose.set('strictQuery', false);

mongoose.connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch(error => {
    console.error("error connecting to MongoDB", error);
  });

app.use(cors());
app.use(express.static('dist'));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.get("/info", (req, res) => {
  Person.countDocuments().then(numberOfPersons => {
    const info = `<p>Phonebook has info for ${numberOfPersons} people</p><p>${new Date()}</p>`;
    res.send(info);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  const person = new Person({
    name,
    number
  });

  person.save().then(returnedPerson => {
    res.json(returnedPerson);
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const person = req.body;

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(error => next(error));
});

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});