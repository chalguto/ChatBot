const sql = require('mssql');
const conn = require('./ConfigSQL');

module.exports = class AsistenciaEmpleado {
    constructor() {}

    //Insert de la Asistencia
    AsistenciaEmpleado_Insert(entAsistencia) {
        return sql.connect(conn)
            .then(pool =>
                // Stored procedure                
                pool.request()
                .input('IdEmpleado', sql.Int, entAsistencia.IdEmpleado)
                .input('Fecha', sql.Date, entAsistencia.Fecha)
                .input('Hora', sql.NVarChar(10), entAsistencia.Hora)
                .input('Motivo', sql.NVarChar(50), entAsistencia.Motivo)
                .execute('spAsistenciaEmpleado_Insert')
            )
            .then(result => {
                sql.close();
                return true;
            })
            .catch(err => {
                console.log(err);
                sql.close();
            });
    }

    //Busca el Empleado
    AsistenciaEmpleado_Select(Identificacion) {
        return sql.connect(conn)
            .then(pool =>
                // Stored procedure
                pool.request()
                .input('Identificacion', sql.Int, Identificacion)
                .execute('spEmpleado_Select')
            )
            .then(result => {
                sql.close();
                return result.recordset[0];
            })
            .catch(err => {
                console.log(err);
                sql.close();
            });
    }
}