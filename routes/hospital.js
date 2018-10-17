var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutentication = require('../middlewares/autentificacion');

var app = express();
//var SEED = require('../config/config').SEED;
var Hospital = require('../models/hospital');


//
// Obtener Todos Los hospitales
//
app.get('/', (req, res, next) => {
    var desde=req.query.desde || 0;
    desde= Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargado hospitales',
                        errors: err
                    });

                }
                Hospital.count({},(err, conteo)=>{
                    res.status(200).json({
                        ok: true,
                        hospitales,
                        total:conteo
                    });


                });

                

            })

});



//
// Actualizar usuario
//
app.put('/:id',mdAutentication.verificaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = body.usuario;

        hospital.save((err, hopitalGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }
            
            res.status(200).json({
                ok: true,
                hospital: hopitalGuardado
            });
        });
    });
});

//
// Crear un nuevo hospital
//
app.post('/',mdAutentication.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });

        }
        //
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            hospitalToken: req.usuario
        });
    });



})


/////
// Borrar Hospital por Id
////

app.delete('/:id',mdAutentication.verificaToken,(req,res)=>{
    var id = req.params.id;
    Hospital.findByIdAndRemove(id,(err,hospitalBorrado)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });

        }
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe hospital con ese ID',
                errors: {message:'No existe hospital con ese ID'}
            });

        }
        //
        res.status(200).json({
            ok: true,
            usuario: hospitalBorrado
        });
    });
});


module.exports = app;