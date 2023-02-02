function warningDobleLimite(valorLimite,valorActual) {
    return (valorActual / valorLimite) <= 0.2 || (valorActual / valorLimite) >= 0.8
}

function warning(valorLimite,valorActual) {
    return  (1 - valorActual/valorLimite) <= 0.3 /*|| (1 - valorActual/valorLimite) > -0.3*/
}

function handleLineColor(theme,indicador,valorActual) {
    let limiteInferior = indicador.limitInferior ?? false
    let limiteSuperior = indicador.limitSuperior ?? false

    if (!!limiteInferior && !!limiteSuperior) {
        if(valorActual>limiteSuperior || valorActual<limiteInferior)
            return theme.palette.error.main
        if(warningDobleLimite(limiteSuperior-limiteInferior,valorActual-limiteInferior))
            return theme.palette.warning.main
        return theme.palette.success.main
    }

    if (!!limiteSuperior) {
        if(valorActual>limiteSuperior)
            return theme.palette.error.main
        if(warning(limiteSuperior,valorActual))
            return theme.palette.warning.main
        return theme.palette.success.main   
    }

    if (!!limiteInferior) {
        if(valorActual<limiteInferior)
          return theme.palette.error.main
        if(warning(valorActual,limiteInferior))
          return theme.palette.warning.main
        return theme.palette.success.main   
    }

}

function handleProgressColor(classes,indicador,valorActual) {
    let limiteInferior = indicador.limitInferior ?? false
    let limiteSuperior = indicador.limitSuperior ?? false

    if (!!limiteInferior && !!limiteSuperior) {
        if(valorActual>limiteSuperior || valorActual<limiteInferior)
            return classes.progressBarError
        if(warningDobleLimite(limiteSuperior-limiteInferior,valorActual-limiteInferior))
            return classes.progressBarWarning
        return classes.progressBarSuccess
    }

    if (!!limiteSuperior) {
        if(valorActual>limiteSuperior)
            return classes.progressBarError
        if(warning(limiteSuperior,valorActual))
            return classes.progressBarWarning
        return classes.progressBarSuccess
    }

    if (!!limiteInferior) {
        if(valorActual<limiteInferior)
          return classes.progressBarError
        if(warning(valorActual,limiteInferior))
          return classes.progressBarWarning
        return classes.progressBarSuccess
    }

}

let formatData = (data, theme, props) => Promise.all(data.map((senData, i) => { 
        return {sensId: senData.id_sensor, color: handleLineColor(theme, props.indicator, senData.valores[0].valor), 
            fecha: senData.valores[0]?.fecha, value: senData.valores[0].valor} 
        })
    )

let formatHistoricDates = (variacion) => {
    var today = new Date();
    today.setDate(today.getDate()-variacion);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hour = String(today.getHours()).padStart(2, '0');
    var min = String(today.getMinutes() + 1).padStart(2, '0'); //January is 0!
    var sec = String(today.getSeconds()).padStart(2, '0');
        
    return yyyy + '-' + mm + '-' + dd + 'T' + hour + ':' + min + ':' + sec;
    
}

const parseDate = (date) => {
    return date.replace('T', ' ').split('.')[0]
  }
  

function getUnit(tipoIndicador) {

    switch (tipoIndicador) {
      case "temperatura":
        return "ºC"
      case "calidad_del_aire":
        return "ppm"
      case "humedad":
        return "%HR"
      case "produccion":
        return "u/hs"
      default:
        return ""
    }
  }

export {
    handleLineColor,
    handleProgressColor,
    formatData,
    formatHistoricDates,
    getUnit,
    parseDate
}