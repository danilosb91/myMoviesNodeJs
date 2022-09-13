const knex = require("../database/knex");

class MovieNotesController {
  async create(request, responde) {
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    const movieNotes_id = await knex("movieNotes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map(name => {
      return {
        name,
        movieNotes_id,
        user_id,
      };
    });

    await knex("movieTags").insert(tagsInsert);

    responde.json();
  }
}

module.exports = MovieNotesController;
