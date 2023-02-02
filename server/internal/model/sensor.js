
const { Int32 } = require('mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const sensor = new Schema({
    nombre: String,
    tipo: String,
    MAC: String,
})

const Sensor = mongoose.model("Sensor", sensor);


const saveSensor = (userData) => {
    let newUser = new Sensor(userData);
    return newUser.save();
}

const findAllType = (tId) => {
    return Sensor.find({tipo: tId})
    .exec()
}

const deleteUser = (userId) => {
    return Sensor.deleteOne({_id: userId})
    .exec()
}

module.exports.saveSensor = saveSensor;
module.exports.findAllType = findAllType;
module.exports.deleteUser = deleteUser;
