const AppError = require("../utils/AppError");

const sqliteConnection = require('../database/sqlite')

class UserController {
  async create(request, responde) {
    const { name, email, password} = request.body;

    const database = await sqliteConnection();

    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(checkUserExists){
      throw new AppError("Email já está em uso")
    }


     if (!name) {
      throw new AppError("Nome é obrigatório");
    }

    return responde.status(201).json()
 
  }
}

module.exports = UserController;
