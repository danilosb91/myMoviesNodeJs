const AppError = require("../utils/AppError");

const sqliteConnection = require('../database/sqlite')

class UserController {
  async create(request, responde) {
    const { name, email, password} = request.body;

    const database = await sqliteConnection();

    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
    
    if (!name) {
     throw new AppError("Nome é obrigatório");
   }

    if(checkUserExists){
      throw new AppError("Email já está em uso")
    }

    await database.run("INSERT INTO users (name, email, password) VALUES (?,?,?)",[name, email, password])



    return responde.status(201).json()
 
  }
}

module.exports = UserController;
