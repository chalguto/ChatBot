const AsistenciaEmpleadoBLL = require('../BLL/AsistenciaEmpleadoBLL');

module.exports = class clsForBusiness {
    constructor(_topIntent, _entity, _entAsistencia) {
        this.TopIntent = _topIntent;
        this.Entity = _entity;
        this.entAsistencia = _entAsistencia
    }

    // Getter
    get Business() {
        return this.ForBusiness(this.TopIntent);
    }

    // Method
    ForBusiness(qry) {
        let resBusiness;
        switch (qry) {
            case "Consultar.Fecha.Llegada":
                resBusiness = AsistenciaEmpleado_Select();
                break;
            case "Consultar.Fecha.Salida":
                resBusiness = AsistenciaEmpleado_Select();
                break;
            case "Consultar.Fecha.Ingreso":
                resBusiness = AsistenciaEmpleado_Select();
                break;
            case "Consultar.Horas":
                resBusiness = new AsistenciaEmpleadoBLL().AsistenciaEmpleado_HorasByFecha(this.entAsistencia);
                break;
            case "Consultar.Identificacion":
                resBusiness = new AsistenciaEmpleadoBLL().AsistenciaEmpleado_Select(this.entAsistencia.Identificacion);
                break;
            case "Registrar.Llegada":
                resBusiness = new AsistenciaEmpleadoBLL().AsistenciaEmpleado_Insert(this.entAsistencia);
                break;
            case "Registrar.Salida":
                resBusiness = new AsistenciaEmpleadoBLL().AsistenciaEmpleado_Insert(this.entAsistencia);
                break;
        }
        return resBusiness;
    }
};