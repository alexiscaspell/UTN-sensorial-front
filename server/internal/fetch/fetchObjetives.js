const fetch = require('node-fetch');

const fetchObjetiveStatus = async (dashid,objetivoId) => {

    try {
        const response = await fetch(`${process.env.RESTAPI_URL}/api/v1/tableros/${dashid}/objetivos/${objetivoId}/calculado`, {
            method: 'GET'
        });
        var sensorsData = await response.json();
        return sensorsData
    } catch (e) {

    }
}

module.exports.fetchObjetiveStatus = fetchObjetiveStatus;
