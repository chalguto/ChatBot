module.exports = class EntIdentificacion {
    constructor(_identificacion) {
        this.id = _identificacion.id != undefined ? _identificacion.id : '';
        this.Identificacion = _identificacion.Identificacion != undefined ? _identificacion.Identificacion : _identificacion;
        this.Nombre = _identificacion.Nombre != undefined ? _identificacion.Nombre : '';
        this.Apellido = _identificacion.Apellido != undefined ? _identificacion.Apellido : '';
    }
}