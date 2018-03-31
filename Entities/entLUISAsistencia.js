module.exports = class EntLUISAsistencia {
    constructor(_intent, _typeEntity) {
        this.Intent = _intent;
        this.TypeEntity = _typeEntity;
        this.Identificacion = {};
        this.Fecha = new Date();
        this.Hora = '';
    }
}