var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutentication = require('../middlewares/autentificacion');

var app = express();
//var SEED = require('../config/config').SEED;
var Usuario = require('../models/usuario');


//
// Obtener Todos Los Usuarios
//
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img rol')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargado usuarios',
                        errors: err
                    });

                }
                res.status(200).json({
                    ok: true,
                    usuarios
                });

            })

});



//
// Actualizar usuario
//
app.put('/:id',mdAutentication.verificaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.rol = body.rol;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuarios',
                    errors: err
                });
            }
            usuarioGuardado.password=':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

//
// Crear un nuevo usuario
//
app.post('/',mdAutentication.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        rol: body.rol
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuarios',
                errors: err
            });

        }
        //
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });



})


/////
// Borrar Usuario por Id
////

app.delete('/:id',mdAutentication.verificaToken,(req,res)=>{
    var id = req.params.id;
    Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });

        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con ese ID',
                errors: {message:'No existe usuario con ese ID'}
            });

        }
        //
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});


module.exports = app;