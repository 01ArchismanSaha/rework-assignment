const Book = require("../models/Book");
const Magazine = require("../models/Magazine");
const Author = require("../models/Author");
const fs = require("fs");
const csv = require("csv-parser");


const path = require("path");
const csvFilePath = path.join(__dirname, "../data");

exports.csvReader = (req, res) => {
  //   console.log(req.query);
  const csvSource = req.query.csvSource; // get selected CSV source from query parameter
  if (csvSource === "books") {
    readBookCSV(csvSource, csvFilePath, res);
  } else if (csvSource === "magazines") {
    readMagazineCSV(csvSource, csvFilePath, res);
  } else if (csvSource === "authors") {
    readAuthorCSV(csvSource, csvFilePath, res);
  } else {
    res.status(400).send("Invalid CSV source");
  }
};

const readBookCSV = (csvSource, csvFilePath, res) => {
  let totalRows = 0;
  let rowsProcessed = 0;
  fs.createReadStream(`${csvFilePath}/${csvSource}.csv`)
    .pipe(csv({ separator: ";" }))
    .on("data", async (data) => {
      totalRows++;
      const existingBook = await Book.findByPk(data.isbn);
      if (!existingBook) {
        await Book.create({
          isbn: data.isbn,
          title: data.title,
          authorEmail: data.authors,
          description: data.description,
        });
      }
      rowsProcessed++;
      if (rowsProcessed === totalRows) {
        const books = await Book.findAll();
        res.json(books);
      }
    })
    .on("end", async () => {
      if (totalRows === 0) {
        res.json([]);
      }
    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
};

const readMagazineCSV = (csvSource, csvFilePath, res) => {
  let totalRows = 0;
  let rowsProcessed = 0;
  fs.createReadStream(`${csvFilePath}/${csvSource}.csv`)
    .pipe(csv({ separator: ";" }))
    .on("data", async (data) => {
      totalRows++;
      const existingMagazine = await Magazine.findByPk(data.isbn);
      if (!existingMagazine) {
        await Magazine.create({
          isbn: data.isbn,
          title: data.title,
          authorEmail: data.authors,
          publishedAt: data.publishedAt,
        });
      }
      rowsProcessed++;
      if (rowsProcessed === totalRows) {
        const magazines = await Magazine.findAll();
        res.json(magazines);
      }
    })
    .on("end", async () => {
      if (totalRows === 0) {
        res.json([]);
      }
    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
};

const readAuthorCSV = (csvSource, csvFilePath, res) => {
  let totalRows = 0;
  let rowsProcessed = 0;
  fs.createReadStream(`${csvFilePath}/${csvSource}.csv`)
    .pipe(csv({ separator: ";" }))
    .on("data", async (data) => {
      totalRows++;
      const existingAuthor = await Author.findByPk(data.email);
      if (!existingAuthor) {
        await Author.create({
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
        });
      }
      rowsProcessed++;
      if (rowsProcessed === totalRows) {
        const authors = await Author.findAll();
        res.json(authors);
      }
    })
    .on("end", async () => {
      if (totalRows === 0) {
        res.json([]);
      }
    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
};
