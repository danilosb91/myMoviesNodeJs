const { hash } = require("bcrypt")
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

    const hashedPassword = await hash(password, 8)

    await database.run("INSERT INTO users (name, email, password) VALUES (?,?,?)",[name, email, hashedPassword])



    return responde.status(201).json()
 
  }
  // Fim do cadastro de usuário.

  async update(request, responde){
    const { name, email } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection(); //Conexão com o banco
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]) // Traz as informações do banco com o ID
    //verifica sem o usuário existe
    if(!user){
      throw new AppError("Usuário não encontrado")
    }
    // verifica se o email existe no banco. 
    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]) 
    console.log(userWithUpdatedEmail  )
    
    //Verifica se o email existe && Verifica se o ID do banco é igual ao ID informado
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id ){
      throw new AppError("Está email já está em uso")
    }
    
    user.name = name;
    user.email = email;

    if(password && !old_password){
      throw new AppError("Informar a senha antiga para definir a nova senha")
    }


    await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    updated_at = ?
    WHERE id = ?`,
    [user.name, user.email, new Date(), id]);

    return responde.status(200).json()

  }
}

module.exports = UserController;
