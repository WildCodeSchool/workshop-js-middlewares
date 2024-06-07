const tables = require("../../database/tables");

const browse = async (req, res, next) => {
  try {
    const [albums] = await tables.albums.readAll();
    res.json(albums);
  } catch (err) {
    next(err);
  }
};

const read = async (req, res, next) => {
  try {
    const [[album]] = await tables.albums.read(req.params.id);
    if (album) res.json(album);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

const add = async (req, res, next) => {
  const albumData = req.body;
  try {
    const [{ insertId }] = await tables.albums.create(albumData);
    const [[album]] = await tables.albums.read(insertId);
    res.status(201).json(album);
  } catch (err) {
    next(err);
  }
};

const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const albumData = req.body;
    const [result] = await tables.albums.update(albumData, id);
    if (result.affectedRows > 0) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await tables.albums.delete(id);
    if (result.affectedRows > 0) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
};
