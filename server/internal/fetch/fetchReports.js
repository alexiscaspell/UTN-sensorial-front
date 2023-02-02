
const fetch = require('node-fetch');

const saveReport = async (dashid,reportData) => {
    try {
        //console.log(reportData)
        return fetch(`${process.env.RESTAPI_URL}/api/v1/tableros/${dashid}/reportes`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(reportData),
            headers: {'Content-Type': 'application/json'}
        });
    } catch (e) {
        console.log(e)
    }
}

const deleteReport = async (dashId, reportId) => {
    try {
        return fetch(`${process.env.RESTAPI_URL}/api/v1/tableros/${dashId}/reportes/${reportId}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        });
    } catch (e) {
        console.log(e)
    }
}

module.exports.saveReport = saveReport;
module.exports.deleteReport = deleteReport;