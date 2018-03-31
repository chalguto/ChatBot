const AsistenciaEmpleadoDAL = require('../DAL/AsistenciaEmpleadoDAL'),
    Asistencia = require('../Entities/entAsistencia');

module.exports = class AsistenciaEmpleado {
    constructor() {}

    //Insert de la Asistencia
    AsistenciaEmpleado_Insert(objAsistencia) {
        return new AsistenciaEmpleadoDAL().AsistenciaEmpleado_Insert(objAsistencia)
            .then(res => res)
            .catch(err => {
                throw (err);
            });
    }

    //Busca el Empresa
    AsistenciaEmpleado_Select(objIdentificacion) {
        return new AsistenciaEmpleadoDAL().AsistenciaEmpleado_Select(objIdentificacion.Identificacion)
            .then(res => res)
            .catch(err => {
                throw (err);
            });
    }

    //Busca los registros del Empleado 
    AsistenciaEmpleado_HorasByFecha(objAsistencia) {
        return new AsistenciaEmpleadoDAL().AsistenciaEmpleado_SelectCondition({
                query: 'SELECT * FROM root r WHERE r.Identificacion = @Identificacion and r.Fecha = @Fecha',
                parameters: [{
                        name: "@Identificacion",
                        value: objAsistencia.Identificacion
                    },
                    {
                        name: '@Fecha',
                        value: objAsistencia.Fecha
                    }
                ]
            })
            .then(res => {
                //Calcula las horas trabajadas
                let resHoras = objAsistencia;
                let start = (res[0].Hora).split(":"),
                    end = (res[1].Hora).split(":"),
                    t1 = new Date(),
                    t2 = new Date();

                t1.setHours(start[0], start[1], start[2]);
                t2.setHours(end[0], end[1], end[2]);
                t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());

                resHoras.Hora = (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas" : " hora") : "") + (t1.getMinutes() ? ", " + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");
                return resHoras;
            })
            .catch(err => {
                throw (err);
            });
    }
};