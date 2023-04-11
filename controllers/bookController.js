const Book = require("../models/Book");
const Magazine = require("../models/Magazine");

const fs = require("fs");
const Papa = require("papaparse");

// retrieves book/magazine
exports.getBook = (req, res) => {
  const searchCriteria = req.query.search_criteria;
  const query = req.query.query;
  //   console.log(searchCriteria)
  //   console.log(query)

  if (searchCriteria === "isbn") {
    Book.findByPk(query)
      .then((book) => {
        if (!book) throw Error("Could not find the book!");
        res.status(200).json([book]);
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json(err);
      });
  } else if (searchCriteria === "author_email") {
    console.log("this ran");
    Book.findAll({ where: { authorEmail: query } })
      .then((books) => {
        console.log("this ran as well");
        if (books.length === 0) throw Error("No books found!");
        res.status(200).json(books);
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json(err);
      });
  } else {
    // no search criteria provided
    res.send("Please select a search criteria.");
  }
};

exports.sortBooksMagazines = async (req, res) => {
  // merge books and magazines and sort by title
  const merged = await Promise.all([Book.findAll(), Magazine.findAll()])
    .then(([books, magazines]) => books.concat(magazines))
    .then((merged) => merged.sort((a, b) => a.title.localeCompare(b.title)))
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.addBook = async (req, res) => {
  //   console.log(req.body);
  try {
    const { title, isbn, authorEmail, type, description, publishedAt } =
      req.body;
    // create new book/magazine object
    const newBookMagazine = {
      type,
      title,
      isbn,
      authorEmail,
      ...(type === "magazine" && { publishedAt }),
      ...(type === "book" && { description }),
    };

    if (type === "book") {
      try {
        await Book.create(newBookMagazine);
      } catch (error) {
        throw error;
      }
    } else if (type === "magazine") {
      try {
        await Magazine.create(newBookMagazine);
      } catch (error) {
        throw error;
      }
    }

    // Find all the books and magazines in updated database
    Promise.all([Book.findAll(), Magazine.findAll()])
      .then(([books, magazines]) => {
        const data = [...books, ...magazines]; // Combining books and magazines into a single array
        // Convert the array of model instances to an array of plain objects
        const plainObjects = data.map((instance) =>
          instance.get({ plain: true })
        );
        const csv = Papa.unparse(plainObjects, { header: true }); //converting data to csv
        // Write the CSV string to a file
        fs.writeFile("./data/booksAndMagazines.csv", csv, (err) => {
          if (err) {
            throw Error(err);
          } else {
            console.log("Data exported to booksAndMagazines.csv");
            res
              .status(200)
              .json({ success: true, message: "New book/magazine added!" });
          }
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};
