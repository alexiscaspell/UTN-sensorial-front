require('dotenv').config()

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

const BASE_URL = process.env.BASE_URL ?? "https://sensorial-base.herokuapp.com";  // "http://localhost:8080";
const BACKEND_URL = process.env.BACKEND_URL || "https://sensorial-back.herokuapp.com";

const createHeaders = () => {
    var authToken = localStorage.getItem("id_token")
    return !!authToken ? {
        ...headers,
        'Authorization': authToken /*'Bearer ' + */
    } : headers;
}

const loginUser = async (loginValue, passwordValue) => {
    try {

        return await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(
                {
                    mail: loginValue,
                    password: passwordValue
                }),
        });
    } catch (error) {
        console.log(error)
    }
}

const logout = async () => {
    try {
        return await fetch(`${BASE_URL}/logout`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(
                {
                    session_id: localStorage.getItem("id_session")
                }),
        });
    } catch (error) {
        console.log(error)
    }
}

const getUserDashboards = async () => {
    try {
        //console.log("entra a user dashboards")
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards`, {
            method: 'GET',
            headers: createHeaders()
        });
    } catch (e) {
        console.log(e)
    }
}

const getAllDashboardsData = async () => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboardsdata`, {
            method: 'GET',
            headers: createHeaders()
        });
    } catch (e) {
        console.log(e)
    }
}

const saveDashboard = async (userData) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(userData),
        })
    } catch (e) {
        console.log(e)
    }
}

const deleteDashboards = async (dashboardId) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashboardId}`, {
            method: 'DELETE',
            headers: createHeaders()
        });
    } catch (e) {
        console.log(e)
    }
}

const getAllUsersData = async () => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/users`, {
            method: 'GET',
            headers: createHeaders()
        });
    } catch (e) {
        console.log(e)
    }
}

const saveUser = async (userData) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/users`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(userData),
        })
    } catch (e) {
        console.log(e)
    }
}

const deleteUser = async (usersId) => {
    try {
        //console.log(usersId)
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/users/${usersId}`, {
            method: 'DELETE',
            headers: createHeaders()
        });
    } catch (e) {
        console.log(e)
    }
}

const getAllReportes = async (dashboardId) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashboardId}/reportes`, {
            method: 'GET',
            headers: createHeaders()
        });
    } catch (e) {
        console.log(e)
    }
}

const saveReport = async (dashboardId, newReport) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashboardId}/reportes`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(newReport),
        });
    } catch (e) {
        console.log(e)
    }
}

const deleteReport = async (dashboardId, repotsId) => {
    try {

        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashboardId}/reports/${repotsId}`, {
            method: 'DELETE',
            headers: createHeaders()
        });
    } catch (e) {
        console.log(e)
    }
}

const getSensores = async (sensorType) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/sensors/${sensorType}`, {
            method: 'GET',
            headers: createHeaders()
        });
    } catch (e) {
        console.log(e)
    }
}

const saveIndicator = async (dashId, indicator) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashId}/indicators`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(indicator),
        })
    } catch (e) {
        console.log(e)
    }
}

const updateIndicator = async (dashId, indicator, indicatorId) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashId}/indicators/${indicatorId}`, {
            method: 'PATCH',
            headers: createHeaders(),
            body: JSON.stringify(indicator),
        })
    } catch (e) {
        console.log(e)
    }
}

const deleteIndicator = async (dashId, indicatorId) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashId}/indicators/${indicatorId}`, {
            method: 'DELETE',
            headers: createHeaders(),
        })
    } catch (e) {
        console.log(e)
    }
}

const getDashboardData = async (dashboardId) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashboardId}`, {
            method: 'GET',
            headers: createHeaders()
        });
    } catch (e) {
        console.log(e)
    }
}

const saveObjetivo = async (dashId, objetive) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashId}/objetives`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(objetive),
        })
    } catch (e) {
        console.log(e)
    }
}

const deleteObjetivo = async (dashId, objId) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashId}/objetives/${objId}`, {
            method: 'DELETE',
            headers: createHeaders(),
        })
    } catch (e) {
        console.log(e)
    }
}

const getIndicatorData = async (dashboardId, indicatorId, numMuestras) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashboardId}/indicators/${indicatorId}?muestras=${numMuestras}`, {
            method: 'GET',
            headers: createHeaders()
        });
    } catch (e) {
        console.log(e)
    }
}

const getIndicatorHistoricData = async (dashboardId, indicatorId,  startDate, endDate, granularity, unit ) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashboardId}/indicators/${indicatorId}/historic?desde=${startDate}&hasta=${endDate}&granularidad=${granularity}&unidad=${unit}`, {
            method: 'GET',
            headers: createHeaders()
        });
    } catch (e) {
        console.log(e)
    }
}

const getObjetiveStatus = async (dashboardId, objetiveId) => {
    try {
        return await fetch(`${BASE_URL}/api/${localStorage.getItem("id_session")}/dashboards/${dashboardId}/objetives/${objetiveId}/status`, {
            method: 'GET',
            headers: createHeaders()
        });
    } catch (e) {
        console.log(e)
    }
}


export {
    loginUser,
    getUserDashboards,
    getAllUsersData,
    saveDashboard,
    getAllDashboardsData,
    deleteDashboards,
    saveUser,
    deleteUser,
    getAllReportes,
    saveReport,
    deleteReport,
    getSensores,
    getDashboardData,
    saveIndicator,
    updateIndicator,
    deleteIndicator,
    saveObjetivo,
    deleteObjetivo,
    getIndicatorData,
    getIndicatorHistoricData,
    getObjetiveStatus,
    logout
};
