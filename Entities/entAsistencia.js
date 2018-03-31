module.exports = class EntAsistencia {
    constructor(_asistir, _motivo = '') {
        this.IdEmpleado = _asistir.Identificacion.id != undefined ? _asistir.Identificacion.id : '';
        this.Identificacion = _asistir.Identificacion.Identificacion != undefined ? _asistir.Identificacion.Identificacion : '';
        this.Fecha = _asistir.Fecha != undefined ? _asistir.Fecha : '';
        this.Hora = _asistir.Hora != undefined ? _asistir.Hora : '';
        this.Motivo = _motivo;
    }
}