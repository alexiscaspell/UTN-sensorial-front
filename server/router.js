var Usuario = require('./internal/model/user');
var Dashboard = require('./internal/model/dashboard');
var Session = require('./internal/model/session');
var Indicators = require('./internal/fetch/fetchIndicators');
var Objetives = require('./internal/fetch/fetchObjetives');
var Reports = require('./internal/fetch/fetchReports');

module.exports = function (app, db) {

    /********************Middleware***********************/

    if (process.env.NODE_ENV === 'production') {   

        app.use('/api/:session_id/', async function (req, res, next) {
            let session_id = req.params.session_id
            let token = req.header('Authorization');
            if (!!await Session.findSession(session_id, token)) {
                next();
            } else {
                res.status(401)
                    .json({
                    })
            }
        });
    }

    /*app.use('/api/:session_id/', async function (req, res, next) {
        console.log("Time out")
        let session_id = req.params.session_id
        let token = req.header('Authorization');
        if (!!await Session.findSession(session_id, token)) {
            next();
        } else {
            res.status(401)
                .json({
                })
        }
    });*/

    /********************Sockets**********************/
    const server = require('http').createServer(app);
    const { Server } = require("socket.io");
    const io = new Server(server,{
        cors: {
          origin: '*',
          methods: ['GET', 'POST', 'DELETE']
        }
      });

    io.on('connection', socket => {
        //console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    
    socket.on("newIndicator", (data) => {  
        socket.broadcast.emit('newIndicator', data);
    });

    socket.on("deleteIndicator", (data) => {  
        socket.broadcast.emit('deleteIndicator', data);
    });

    socket.on("newObjetive", (data) => {  
        socket.broadcast.emit('newObjetive', data);
    });

    socket.on("deleteObjetive", (data) => {  
        socket.broadcast.emit('deleteObjetive', data);
    });

    socket.on("updateIndicator", (data) => {  
        socket.broadcast.emit('updateIndicator', data);
    });


    socket.on("disconnect", () => {
        //the user is deleted from array of users and a left room message displayed
        socket.disconnect();
      });

    });

    /********************Routes***********************/

    app.post('/login',
        async function (req, res) {
            let { mail, password } = req.body;
            let user = await Usuario.findByUsr(mail)
            if (!!user && password === user.password) {
                let { _doc } = await Session.newSession(user)
                await Usuario.udpateLoginTime(mail)
                res.status(200)
                    .json({
                        ..._doc,
                        nombre: user.nombre,
                    })
            } else { 
                res.status(400)
                    .json({})
            }
        });

    app.post('/logout',
        async function (req, res) {
            let { session_id } = req.body
            await Session.logout(session_id)
            res.status(201).json({})
        });

    app.get('/api/:session_id/dashboards',
        async function (req, res) {
            //console.log("Dashboard names")
            let allDashboards = await Dashboard.findAll()
            let dashNames = [];
            let dashIds = [];
            let i = 0;
            for (let dash of allDashboards) {
                dashNames[i] = dash.nombre;
                dashIds[i] = dash._id;
                i++;
            }

            res.status(200)
                .json({
                    dashboardList: dashNames,
                    dashIds: dashIds
                })
        }
    );

    app.get('/api/:session_id/dashboardsdata',
        async function (req, res) {
            let allDashboards = await Dashboard.findAll()

            let dataArr = [];
            let i = 0;
            for (let dash of allDashboards) {
                let dashArr = [];
                dashArr[0] = dash.nombre;
                dashArr[1] = dash.descripcion;
                dashArr[2] = dash.fecha_creacion;
                dashArr[3] = dash._id;
                dataArr[i] = dashArr;
                i++;
            }
            res.status(200)
                .json({ data: dataArr })
        })

    app.post('/api/:session_id/dashboards',
        async function (req, res) {
            let newDash = await Dashboard.saveDashboard(req.body)
            if (!!newDash._id) {
                res.status(200).json(newDash)
            } 
            res.sendStatus(500);
        }
    );

    app.delete('/api/:session_id/dashboards/:id_dashbaord',
        async function (req, res) {
            try {
                let dashid = req.params.id_dashbaord
                await Dashboard.deleteDashboard(dashid)
                res.sendStatus(201);
            } catch (e) {
                res.sendStatus(404);
            }
        }
    )

    app.get('/api/:session_id/users',
        async function (req, res) {
            let allUsers = await Usuario.findAll()
            let dataArr = [];
            let i = 0;
            for (let user of allUsers) {
                let userArr = [];
                userArr[0] = user.mail;
                userArr[1] = user.nombre;
                userArr[2] = user.rol;
                userArr[3] = user.fecha_creacion;
                userArr[4] = user.ultimo_login;
                userArr[5] = user._id;
                dataArr[i] = userArr;
                i++;
            }
            res.status(200)
                .json({ data: dataArr })
        }
    );

    app.post('/api/:session_id/users',
        async function (req, res) {
            try {
                let user = await Usuario.findByUsr(req.body.mail);
                if(!!user) res.status(409).json({msg: "user already exist"})

                let newUser = await Usuario.saveUser(req.body)
                res.status(200).json(newUser)
            
            } catch (e) {
                res.sendStatus(500);
            }

        }
    );

    app.delete('/api/:session_id/users/:id_user',
        async function (req, res) {
            try {
                let usersid = req.params.id_user
                await Usuario.deleteUser(usersid)
                res.sendStatus(201);
            } catch (e) {
                res.sendStatus(404);
            }

        }
    );

    app.get('/api/:session_id/dashboards/:id_dashboard/reportes',
        async function (req, res) {
            let dashboardId = req.params.id_dashboard
            let reportes = await Dashboard.getReportes(dashboardId)
            let dataArr = [];
            let i = 0;
            for (let dash of reportes) {
                let dashArr = [];
                dashArr[0] = dash.nombre;
                dashArr[1] = dash.descripcion;
                dashArr[2] = dash.destinatarios.join(', ');
                dashArr[3] = dash.dia;
                dashArr[4] = dash.horario;
                dashArr[5] = dash._id;
                dataArr[i] = dashArr;
                i++;
            }
            res.status(200)
                .json({ data: dataArr })
        })

    app.post('/api/:session_id/dashboards/:id_dashboard/reportes/',
        async function (req, res) {
            try {
                let dashboardId = req.params.id_dashboard
                let resD = await Reports.saveReport(dashboardId, req.body)
                let data = await resD.json()
                if (resD.status < "400") {
                    res.status(200).json(data);
                } else {
                    res.sendStatus(500);
                }
            } catch (e) {

            }
        })

    app.delete('/api/:session_id/dashboards/:id_dashboard/reports/:id_report',
        async function (req, res) {
            try {
                let dashId = req.params.id_dashboard
                let reportId = req.params.id_report
                await Reports.deleteReport(dashId, reportId)
                res.sendStatus(201);
            } catch (e) {
                res.sendStatus(404);
            }
        }
    );

    app.get('/api/:session_id/sensors/:sensorType',
        async function (req, res) {
            let sensorType = req.params.sensorType

            let allSensors = await Dashboard.findAllType(sensorType)

            //let sensNames = [];
            //let sensId = [];
            /*let i = 0;
            for (let dash of allSensors) {
                sensNames[i] = dash.nombre;
                sensId[i] = dash.MAC;
                i++;
            }
            res.status(200)
                .json({
                    sensorList: sensNames,
                    sensorsIds: sensId
                })*/
            res.status(200)
                .json(allSensors)
        }
    );

    app.post('/api/:session_id/sensors',
        async function (req, res) {
            try {
                let newSensor = await Dashboard.saveSensor(req.body)
                res.status(200)
                    .json(newSensor)
            } catch (e) {

            }
        })

    app.get('/api/:session_id/dashboards/:id_dashboard',
        async function (req, res) {
            try {
                let dashid = req.params.id_dashboard
                let arrInd = await Dashboard.getIndicators(dashid)
                let arrObjs = await Dashboard.getObjetives(dashid)
                console.log(arrObjs)
                //falta levantar la data a partir de cada array de sensores de 
                res.status(200)
                    .json({
                        indicators: arrInd,
                        objetives: arrObjs
                    })
            } catch (e) {
                res.status(500)
                    .json({
                    })
            }

        }
    );

    app.post('/api/:session_id/dashboards/:id_dashboard/indicators',
        async function (req, res) {
            try {
                let dashboardId = req.params.id_dashboard
                if (!req.body.refreshRate) 
                    throw "Missing fields";

                let newIndicator = await Dashboard.saveIndicator(dashboardId, req.body)
                res.status(200)
                    .json(newIndicator) //faltaria pedir newIndicator los datos de los sensores para el indicador 
            } catch (e) {
                 res.sendStatus(400)
            }
        })
    

    app.patch('/api/:session_id/dashboards/:id_dashboard/indicators/:indicatorId',
    async function (req, res) {
        try {
            let dashboardId = req.params.id_dashboard
            let indicatorId = req.params.indicatorId
            console.log(req.body)
            if (!indicatorId) {
                console.log("Missing indicator id");
                throw "Missing indicator id";
            }
            if (!req.body.name) {
                console.log("Missing nombre");
                throw "Missing nombre";
            }
                
            if (!req.body.type) {
                console.log("Missing tipo indicador");
                throw "Missing tipo indicador";
            }
                
            if (!req.body.sensors) {
                console.log("Missing selected sensors");
                throw "Missing selected sensors";
            }
        
            if (!req.body.refreshRate) {
                console.log("Missing refresh rate");
                throw "Missing refresh rate";
            }

            

            let newIndicator = await Dashboard.updateIndicator(dashboardId, req.body, indicatorId)
            res.status(200)
                .json(newIndicator) //faltaria pedir newIndicator los datos de los sensores para el indicador 
        } catch (e) {
             res.sendStatus(400)
        }
    })

    app.delete('/api/:session_id/dashboards/:id_dashboard/indicators/:id_indicator',
        async function (req, res) {
            try {
                let dashboardId = req.params.id_dashboard
                let indId = req.params.id_indicator
                await Dashboard.deleteIndicator(dashboardId, indId)
                res.status(200).json({})

            } catch (e) {

            }
        })

    app.post('/api/:session_id/dashboards/:id_dashboard/objetives',
        async function (req, res) {
            try {
                let dashboardId = req.params.id_dashboard
                let newObje = await Dashboard.saveObjetives(dashboardId, req.body)
                console.log(newObje)
                res.status(200)
                    .json(newObje)
                console.log(newObje)
            } catch (e) {
                res.status(500)
                    .json({})
            }
        })


    app.delete('/api/:session_id/dashboards/:id_dashboard/objetives/:id_objetive',
        async function (req, res) {
            try {
                let dashboardId = req.params.id_dashboard
                let objId = req.params.id_objetive
                //console.log(`Obj ${objId} por borrar`)
                await Dashboard.deleteObjetives(dashboardId, objId)
                //console.log(`Obj ${objId} borrado`)
                res.status(200).json({})

            } catch (e) {

            }
        })

    app.get('/api/:session_id/dashboards/:id_dashboard/objetives/:id_objetive',
        async function (req, res) {
            try {
                //console.log("Refresh_obj")
                let dashboardId = req.params.id_dashboard
                let objId = req.params.id_objetive
                let objetiveData = await Objetives.fetchObjetiveData(dashboardId, objId)
                //console.log(objetiveData)
                res.status(200).json({ objetiveData })
            } catch (e) {
            }
        }
    )

    app.get('/api/:session_id/dashboards/:id_dashboard/indicators/:id_indicator',
        async function (req, res) {
            try {
                //console.log("Refresh_ind")
                let dashboardId = req.params.id_dashboard
                let indicatorId = req.params.id_indicator
                let cantMuestras = req.query.muestras
                let sensorData = await Indicators.fetchSensorData(dashboardId, indicatorId, cantMuestras)
                //console.log(sensorData)
                res.status(200).json(sensorData)


            } catch (e) {
                throw e
            } 
        }
    )

    app.get('/api/:session_id/dashboards/:id_dashboard/indicators/:id_indicator/historic',
        async function (req, res) {
            try {
                let dashboardId = req.params.id_dashboard
                let indicatorId = req.params.id_indicator

                //console.log("Historic query")
                //console.log(req.query)
                let sensorData = await Indicators.fetchSensorHistoricData(dashboardId, indicatorId, req.query)
                //console.log("Historic result")
                //console.log(sensorData)
                res.status(200)
                    .json(sensorData)
            } catch (e) {
                throw e
            }
        }
    )

    app.get('/api/:session_id/dashboards/:id_dashboard/objetives/:id_objetive/status', 
    async function (req, res) {
        try {
            //console.log("Refresh_obj")
            let dashboardId = req.params.id_dashboard
            let objetiveId = req.params.id_objetive
            let objStatus = await Objetives.fetchObjetiveStatus(dashboardId, objetiveId)
            res.status(200).json(objStatus)
        } catch (e) {
            throw e
        }
    })

    app.use((req, res, next) => { //va ultimo para que en el caso de no encontrar ruta tirar este por default
        res.status(404)
            .type('text')
            .send('Not Found');
    });

    server.listen(process.env.PORT || 8080, () => {
        console.log("Listening on port " + process.env.PORT);
    });

}