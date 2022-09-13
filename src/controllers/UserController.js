const { hash, compare } = require("bcrypt")
const AppError = require("../utils/AppError");
const sqliteConnection = require('../database/sqlite')

class UserController {
  async create(request, response) {
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



    return response.status(201).json()
 
  }
  // Fim do cadastro de usuário.

  async update(request, responde){
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection(); //Conexão com o banco
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]) // Traz as informações do banco com o ID
    //verifica sem o usuário existe
    if(!user){
      throw new AppError("Usuário não encontrado")
    }
    // verifica se o email existe no banco. 
    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]) 
       
    //Verifica se o email existe && Verifica se o ID do banco é igual ao ID informado
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id ){
      throw new AppError("Está email já está em uso")
    }
    
    //Se as verificações passarem, os dados enviado são atualizados na Const USER
    //nullish operator | Se a var Name estiver em branco, será utilizando dos dados do banco para atualização
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    //Verificar se existe a senha antiga e nova.
    if(password && !old_password){
      throw new AppError("Informar a senha antiga para definir a nova senha")
    }
    //Verificar se senha nova e antiga forem informados
    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password); //Usar o compare do Bcrypt para verificar a senha antiga informada e a senha do banco
      
      if(!checkOldPassword){
        throw new AppError("A Senha antiga não confere.")
      }

      user.password = await hash(password, 8); //Se passar por todas as verificações, a senha é atualizada e criptografada

    }


    await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    password =?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
    [user.name, user.email, user.password, id]);

    return responde.status(200).json()

  }
}

module.exports = UserController;
