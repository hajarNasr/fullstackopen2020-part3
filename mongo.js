const mongoose = require("mongoose");

if (process.argv.length === 2) {
  console.log(
    `Please provide the password as an argument: 
          node mongo.js <password> or node mongo.js <password> <name> <number>`
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const mongoURL = `mongodb+srv://hajarnasr:${password}@cluster0.gyzvp.mongodb.net/Cluster0?retryWrites=true&w=majority`;

mongoose.connect(
  mongoURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err, res) => {
    if (err) {
      console.log("Wrong password or something else went wrong", err);
    }
    console.log("DB CONNECTED");
  }
);

const personSchema = new mongoose.Schema({ name: String, number: Number });
const Person = mongoose.model("Person", personSchema);

if (password && !name && !number) {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => console.log(person.name, person.number));
    mongoose.connection.close();
  });
}

if (password && name && number) {
  const newPerson = new Person({ name, number });

  newPerson.save().then((result) => {
    console.log(
      `${name} with phone number: ${number} was successfully added to the database`
    );
    mongoose.connection.close();
  });
}
