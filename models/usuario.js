var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

//Roles Permitidos
var rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}



var usuarioShema = new Schema({
   nombre: { type: String, required:[true,'El nombre es necesario']} ,
   email: { type: String, unique:true , required:[true,'El correo es necesario']} ,
   password: { type: String, required:[true,'La contrasena es necesaria']} ,
   img: { type: String, required:false},
   rol: { type: String, required:true, default:'USER_ROLE',enum: rolesValidos }
});

usuarioShema.plugin(uniqueValidator,{message: '{PATH} debe de ser Unico'} );
module.exports = mongoose.model('Usuario', usuarioShema);