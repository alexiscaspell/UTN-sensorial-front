
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const timeZone = require('mongoose-timezone');
const moment = require('moment-timezone');


const usuario = new Schema({
    mail: String,
    nombre: String,
    rol: String,
    password: String,
    ultimo_login: { type: Date, default: Date.now()  },
    fecha_creacion: { type: Date, default: Date.now() }
})

const Usuario = mongoose.model("Usuario", usuario);

const saveUser = async (userData) => {

    var d = new Date();
    d.setHours(d.getHours() - 3);

    let saveUser = {
        ...userData,
        ultimo_login: moment.tz(d,"America/Argentina/Buenos_Aires").toISOString(true),
        fecha_creacion: moment.tz(d,"America/Argentina/Buenos_Aires").toISOString(true),
    }

    let newUser = new Usuario(saveUser);
    return newUser.save()
}

/*
    const findThreeReply = (threadIdCollection) => {
        let promArray = threadIdCollection.map(tId => {
            return Usuario.find({threadId: tId})
            .sort('-created_on')
            .limit(3)
            .exec()
        })
        return Promise.all(promArray)
    }
*/

const findAll = () => {
    return Usuario.find()
    .exec()
}

const findByUsr = async (mail) => {
    return Usuario.findOne({mail: mail})
    .exec()
}

const deleteUser = (userId) => {
    return Usuario.deleteOne({_id: userId})
    .exec()
}

const udpateLoginTime = async (login) => {
    let usuario = await Usuario.findOne({mail: login})
    .exec()
    usuario.ultimo_login = Date.now();
    let result = await usuario.save()

    if(!!result) {
        //let indicadorActualizado = await result.indicadores.filter(indicador => indicador._id == indicatorId)[0]
        //return indicadorActualizado
        return result
    }
         
    throw "Error actualizando el ind"
}

module.exports.saveUser = saveUser;
module.exports.findAll = findAll;
module.exports.findByUsr = findByUsr;
module.exports.deleteUser = deleteUser;
module.exports.udpateLoginTime = udpateLoginTime;