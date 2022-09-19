const knex = require("../database/knex");

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    const movieNotes_id = await knex("movieNotes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map((name) => {
      return {
        name,
        movieNotes_id,
        user_id,
      };
    });

    await knex("movieTags").insert(tagsInsert);

    response.json();
  }
  // Fim do cadastro de notas
  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movieNotes").where({ id }).first();
    const tags = await knex("movieTags")
      .where({ movieNotes_id: id })
      .orderBy("name");

    return response.json({
      ...note,
      tags,
    });
  }
  //Fim da exibição de notas

  async delete(request, response) {
    const { id } = request.params;

    await knex("movieNotes").where({ id }).delete();

    return response.json();
  }
  //Fim do exclusão de notas
  async index(request, response) {
    const { title, user_id, tags } = request.query;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map(tag => tag.trim());

      notes = await knex("movieTags")
        .select([
        "movieNotes.id",
        "movieNotes.title",
        "movieNotes.user_id"
      ])
        .where("movieNotes.user_id", user_id)
        .whereLike("movieNotes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("movieNotes", "movieNotes.id", "movieTags.movieNotes_id")
        .orderBy("movieNotes.title");
    } else {
      notes = await knex("movieNotes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    return response.json(notes);
  }
}

module.exports = MovieNotesController;
