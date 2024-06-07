const setStatusAdmin = (req, res, next) => {
  req.isAdmin = true;
  next();
};

const checkStatusAdmin = (req, res, next) => {
  let error;
  if (!req.isAdmin) {
    error = {
      type: "adminStatus",
      message: "You must be admin to create data.",
    };
  }

  if (error) res.status(403).json(error);
  else next();
};

const validateData = (req, res, next) => {
  const { title, genre, picture, artist } = req.body;

  const errors = [];

  if (!title || !genre || !picture || !artist) {
    errors.push({
      type: "dataNull",
      message: "The fields title, genre, picture, artist are mandatory",
    });
  }
  if (title?.length < 3 || typeof title !== "string") {
    errors.push({
      type: "incorrectData",
      message: "Title must be a string with at least 3 characters.",
    });
  }
  const genres = ["Rap", "Rock", "Electro"];
  // if (genre !== "Rap" && genre !== "Rock" && genre !== "Electro") {
  if (!genres.includes(genre)) {
    errors.push({
      type: "notAllowedData",
      message: "Genre must be Rap, Rock or Electro.",
    });
  }

  if (errors.length === 0) {
    next();
  } else {
    res.status(400).json(errors);
  }
};

module.exports = { setStatusAdmin, checkStatusAdmin, validateData };
