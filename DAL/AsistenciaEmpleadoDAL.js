const DocumentDBClient = require('documentdb').DocumentClient,
    configDAO = require('./configDAL')

var InterDAO = require('./InterDAO');

//Crea conexion a Azure Cosmo DB
var docDbClient = new DocumentDBClient(configDAO.host, {
    masterKey: configDAO.authKey
});

//Crea el objeto de base de datos
var InterDB = collectionId => new InterDAO(docDbClient, configDAO.databaseId, collectionId).init();

module.exports = class AsistenciaEmpleado {
    constructor() {}

    //Busca el Empleado
    AsistenciaEmpleado_Select(Identificacion) {
        return InterDB('Empleado')
            .then(db => db.getItem(Identificacion))
            .then(result => result)
            .catch(err => {
                throw (err);
            });
    }

    //Busca los registros del Empleado
    AsistenciaEmpleado_SelectCondition(querySpec) {
        return InterDB('AsistenciaEmpleado')
            .then(db => db.getItemCondition(querySpec))
            .then(result => result)
            .catch(err => {
                throw (err);
            });
    }

    //Insert de la Asistencia
    AsistenciaEmpleado_Insert(entAsistencia) {
        return InterDB('AsistenciaEmpleado')
            .then(db => db.addItem(entAsistencia))
            .then(result => result)
            .catch(err => {
                throw (err);
            });
    }

}