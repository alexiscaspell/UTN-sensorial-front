const fetch = require('node-fetch');

const fetchSensorData = async (dashid,indicatorId,cantMuestras) => {
    try {
        const response = await fetch(`${process.env.RESTAPI_URL}/api/v1/tableros/${dashid}/indicadores/${indicatorId}/calculado`, {
            method: 'POST',
            mode: 'cors',
            body: `{"muestras":${cantMuestras}}`,
            headers: {'Content-Type': 'application/json'}
        });
        var sensorsData = await response.json();
        return sensorsData
        //console.log(sensorsData)
        /*let response_json = []

        for (senData of sensorsData) {
            let newDatesValues = {
                ...senData,
                valores: (await Promise.all(senData.valores.map(data => { 
                    return {
                        ...data, 
                        fecha: parseDate(data.fecha)
                    } 
                }))) //esto es pq me llegan al reves los datos
            }
            console.log(newDatesValues)
            response_json.push(newDatesValues)
        }
        //console.log(response_json)
        return response_json;*/
    } catch (e) {
        console.log(e)
    }
}

const fetchSensorHistoricData = async (dashid,indicatorId,body) => {
    try {
        const response = await fetch(`${process.env.RESTAPI_URL}/api/v1/tableros/${dashid}/indicadores/${indicatorId}/historico`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        });

        var sensorsData = await response.json();
        return sensorsData

        /*let response_json = []
        console.log("SENSOR DATA")
        console.log(sensorsData)
        for (senData of sensorsData) {
            console.log(senData.id_sensor)
            let newDatesValues = {
                ...senData,
                valores: (await Promise.all(senData.valores.map(data => { 
                    return {
                        ...data, 
                        fecha: parseDate(data.fecha)
                    } 
                })))
            }
            console.log(newDatesValues)
            response_json.push(newDatesValues)
        }
        return response_json;*/
    } catch (e) {
        console.log(e)
    }
}

const parseDate = (fecha) => {
    try {
        let date = new Date(fecha.split(".")[0])

        let hours = `${date.getHours()}`
        let minutes = `${date.getMinutes()}`
        let seconds = `${date.getSeconds()}`

        let horas = hours.length === 1 ? `0${hours}` : hours
        let minutos = minutes.length === 1 ? `0${minutes}` : minutes
        let segundos = seconds.length === 1 ? `0${seconds}` : seconds
        return `${horas}:${minutos}:${segundos}`

    } catch (e) {

    }
}

const formatData = (sensorsData)  => {
    /*
    [ Actual
        {
            id_sensor: "30:83:98:82:A2:98:A0"
            unidad: "absoluto"
            valores: [
                { 
                    fecha: "00:00:00", 
                    valor: 414.8139534884 
                },
                { 
                    fecha: "23:00:00", 
                    valor: 400.2857142857 
                }
            ]
        },
        {
            id_sensor: "89:83:98:82:A2:98:23"
            unidad: "absoluto"
            valores: [
                { 
                    fecha: "00:00:00", 
                    valor: 198.4654564654 
                },
                { 
                    fecha: "23:00:00", 
                    valor: 228.3546876542 
                }
            ]
        }
    ]
    [ Nuevo
        {
            fecha: "23:00:00"
            30:83:98:82:A2:98:A0: 400.2857142857,
            89:83:98:82:A2:98:23: 228.3546876542,
        },
        {
            fecha: "00:00:00"
            30:83:98:82:A2:98:A0: 414.8139534884,
            89:83:98:82:A2:98:23: 198.4654564654,
        },
    ]
*/
/*
    return sensorsData.map(sensorData => {
        return `{${sensorData.id_sensor} : `
    })*/


}

module.exports.fetchSensorData = fetchSensorData;
module.exports.fetchSensorHistoricData = fetchSensorHistoricData;
module.exports.formatData = formatData;

