var mongoose = require('mongoose');
const moment = require('moment-timezone');
const timeZone = require('mongoose-timezone');

var Schema = mongoose.Schema;

const sensor = new Schema({
    nombre: String,
    tipo: String,
    MAC: String,
})

const Sensor = mongoose.model("Sensor", sensor);


const indicador = new Schema({
    name: String,
    type: String,
    sensors: [sensor],
    limitSuperior: String,
    limitInferior: String,
    refreshRate: { type: Number, default: 10 },
})

const objetivo = new Schema({
    name: String,
    description: String,
    value: String,
    startDate: String,
    endDate: String,
    indicatorName: String,
    indicatorId: String,
})
objetivo.plugin(timeZone, { paths: ['startDate', 'endDate'] });


const reporte = new Schema({
    nombre: String,
    descripcion: String,
    destinatarios: [String],
    dia: String,
    horario: String
})

const dashboard = new Schema({
    nombre: String,
    descripcion: String,
    fecha_creacion: { type: Date, default: Date.now() },
    reportes: [reporte],
    objetivos: [objetivo],
    indicadores: [indicador],
})



const Dashboard = mongoose.model("Dashboard", dashboard);

const saveDashboard = async (dashboardData) => {
    var d = new Date();
    d.setHours(d.getHours() - 3);

    let saveDash = {
        ...dashboardData,
        fecha_creacion: moment.tz(d,"America/Argentina/Buenos_Aires").toISOString(true),
    }

    let newDash = new Dashboard(saveDash);
    return newDash.save();
    /*return {
        ...resdas,
        fecha_creacion: d,
    }*/
}

const findAll = () => {
    return Dashboard.find()
    .exec()
}

const deleteDashboard = (dashId) => {
    return Dashboard.deleteOne({_id: dashId})
    .exec()
}

const getReportes = async (dashId) => {
    let dashboard = await Dashboard.findById(dashId)
    .exec()
    return dashboard.reportes
}

const saveReport = async (dashId,newReport) => {
    let dashboard = await Dashboard.findById(dashId)
    .exec()
    dashboard.reportes.push(newReport)
    return dashboard.save();
}

const deleteReport = async (dashId,reportId) => {
    let dashboard = await Dashboard.findById(dashId)
    .exec()
    dashboard.reportes.id(reportId).remove()
    return dashboard.save();
}

const getIndicators = async (dashId) => {
    let dashboard = await Dashboard.findById(dashId)
    .exec()
    return dashboard.indicadores
}

const saveIndicator = async (dashId,newInd) => {
    let dashboard = await Dashboard.findById(dashId)
    .exec()
    dashboard.indicadores.push(newInd)
    dashboard.save();
    return dashboard.indicadores[dashboard.indicadores.length - 1]

}

const updateIndicator = async (dashId,newInd,indicatorId) => {
    //console.log(newInd)
    //console.log(indicatorId)
    let dashboard = await Dashboard.findById(dashId)
    .exec()
    dashboard.indicadores.id(indicatorId).name = newInd.name
    dashboard.indicadores.id(indicatorId).type = newInd.type
    dashboard.indicadores.id(indicatorId).sensors = newInd.sensors
    dashboard.indicadores.id(indicatorId).refreshRate = newInd.refreshRate
    dashboard.indicadores.id(indicatorId).limitInferior = newInd.limitInferior
    dashboard.indicadores.id(indicatorId).limitSuperior = newInd.limitSuperior

    let result = await dashboard.save()

    if(!!result) {
        //let indicadorActualizado = await result.indicadores.filter(indicador => indicador._id == indicatorId)[0]
        //return indicadorActualizado
        return result.indicadores
    }
         
    throw "Error actualizando el ind"
}

const deleteIndicator = async (dashId,reportId) => {
    let dashboard = await Dashboard.findById(dashId)
    .exec()
    dashboard.indicadores.id(reportId).remove();
    return dashboard.save();
}

const getObjetives = async (dashId) => {
    let dashboard = await Dashboard.findById(dashId)
    .exec()
    return dashboard.objetivos
}

const saveObjetives = async (dashId,newObj) => {
    let dashboard = await Dashboard.findById(dashId)
    .exec()

    dashboard.objetivos.push(newObj)

    const newObjetives = await Promise.all(dashboard.objetivos.map(obj => correctTimeZone(obj)));

    dashboard.objetivos = newObjetives
    dashboard.save();

    return dashboard.objetivos[dashboard.objetivos.length-1];

} 

const correctTimeZone = async (obj) => {
    obj._doc.startDate = moment.tz(obj._doc.startDate,"America/Argentina/Buenos_Aires").toISOString(true)
    obj._doc.endDate = moment.tz(obj._doc.endDate,"America/Argentina/Buenos_Aires").toISOString(true)
    return obj
}
 
const deleteObjetives = async (dashId,objId) => {
    console.log(`Obj ${objId} por borrar del ${dashId}`)
    let dashboard = await Dashboard.findById(dashId)
    .exec()
    dashboard.objetivos.id(objId).remove()
    return dashboard.save();
}

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

module.exports.saveDashboard = saveDashboard;
module.exports.findAll = findAll;
module.exports.deleteDashboard = deleteDashboard;
module.exports.getReportes = getReportes;
module.exports.saveReport = saveReport;
module.exports.deleteReport = deleteReport;
module.exports.getIndicators = getIndicators;
module.exports.saveIndicator = saveIndicator;
module.exports.updateIndicator = updateIndicator;
module.exports.deleteIndicator = deleteIndicator;
module.exports.getObjetives = getObjetives;
module.exports.saveObjetives = saveObjetives;
module.exports.deleteObjetives = deleteObjetives;
module.exports.saveSensor = saveSensor;
module.exports.findAllType = findAllType;
module.exports.deleteUser = deleteUser;