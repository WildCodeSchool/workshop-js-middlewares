const AbstractRepository = require("./AbstractRepository");

class AlbumRepository extends AbstractRepository {
  constructor() {
    super({ table: "albums" });
  }

  async create(album) {
    const { title, genre, picture, artist } = album;
    return this.database.query(
      "INSERT INTO albums (title, genre, picture, artist) VALUES (?, ?, ?, ?)",
      [title, genre, picture, artist]
    );
  }

  async read(id) {
    return this.database.query(
      `select * from ${this.table} where id = ?`,
      [id]
    );
  }

  async readAll() {
    return this.database.query(`select * from ${this.table}`);
  }

  async update(album, id) {
    return this.database.query("UPDATE albums SET ? WHERE id = ?", [album, id]);
  }

  async delete(id) {
    return this.database.query("DELETE FROM albums WHERE id = ?", [id]);
  }
}

module.exports = AlbumRepository;
