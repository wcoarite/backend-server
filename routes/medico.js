var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutentication = require('../middlewares/autentificacion');

var app = express();
//var SEED = require('../config/config').SEED;
var Medico = require('../models/medico');


//
// Obtener todos los medicos
//
app.get('/', (req, res, next) => {
    var desde=req.query.desde || 0;
    desde= Number(desde);
    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital', 'nombre email')
        .exec(
            (err, medico) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargado medicos',
                        errors: err
                    });

                }

Medico.count({},(err, conteo)=>{
    res.status(200).json({
        ok: true,
        medico:medico,
        total:conteo
    });


});

                

            })

});



//
// Actualizar medico
//
app.put('/:id',mdAutentication.verificaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = body.usuario;
        medico.hospital=body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }
            
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

//
// Crear un nuevo medico
//
app.post('/',mdAutentication.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });

        }
        //
        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            medicoToken: req.usuario
        });
    });



})

/////
// Borrar Medico por Id
////

app.delete('/:id',mdAutentication.verificaToken,(req,res)=>{
    var id = req.params.id;
    Medico.findByIdAndRemove(id,(err,medicoBorrado)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });

        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe medico con ese ID',
                errors: {message:'No existe medico con ese ID'}
            });

        }
        //
        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});


module.exports = app;