const botbuilder = require('botbuilder'),
    moment = require('moment'),
    AsistenciaEmpleadoBLL = require('./BLL/AsistenciaEmpleadoBLL'),
    clsForBusiness = require('./BLL/clsForBusiness'),
    clsLUISforDB = require('./BLL/clsLUISforDB');

var entLUISAsistencia = require('./Entities/entLUISAsistencia'),
    entAsistencia = require('./Entities/entAsistencia'),
    entIdentificacion = require('./Entities/entIdentificacion');

module.exports = [
    function(session, args, next) {
        console.log('Dialogo --> *** CONSULTAR ***');

        //La intencion de LUIS        
        session.dialogData.intent = args.intent;
        session.dialogData.typeEntity = args.entities[0].type;

        // Prompt for asistencia
        if (session.userData.asistencia != '') {
            botbuilder.Prompts.text(session, 'Por favor, cuál es tu identificación?');
        } else {
            next();
        }
    },
    function(session, results) {
        //Almacena la Identificacion
        session.dialogData.Identificacion = results.response;

        if (session.dialogData.Identificacion != '') {
            botbuilder.Prompts.text(session, 'Cuál es la fecha que deseas consultar?');
        } else {
            next();
        }
    },
    function(session, results) {
        console.log('Dialogo --> *** CONSULTAR ***. Respuesta');

        //Get Identificacion
        new AsistenciaEmpleadoBLL().AsistenciaEmpleado_Select(new entIdentificacion(session.dialogData.Identificacion))
            .then(res => {

                //Crea el objeto
                let asistir = new entLUISAsistencia(session.dialogData.intent, session.dialogData.typeEntity);
                asistir.Identificacion = new entIdentificacion(res);
                asistir.Fecha = results.response;
                session.userData.asistencia = asistir;

                //Consultar Asistencia
                ConsultarAsistencia(session, asistir);
            });
    }
];

//Se ejecuta la consulta del usuario
ConsultarAsistencia = (session, asistir) => {
    if (asistir.Identificacion != '' && asistir.Identificacion != undefined) {
        //LUIS indica la operacion que se va a realizar        
        new clsLUISforDB().ResponseLUIS(`${session.dialogData.intent} ${session.dialogData.typeEntity}`)
            .then(resLUIS =>

                //De acuerdo a la respuesta de LUIS, se realiza la operacion
                new clsForBusiness(resLUIS.topScoringIntent.intent,
                    resLUIS.entities[0].entity,
                    new entAsistencia(asistir, resLUIS.topScoringIntent.intent))
                .Business
            )
            .then(res => {
                //Muestra el mensaje de registro
                session.endDialog(viewMessage(asistir, res));

                session.userData.asistencia = {};
                console.log("inicializando userData.asistencia para manejar la Asistencia");
            });
    } else {
        session.endDialog('De acuerdo, asegúrete de ingresar correctamente su identificación o intenta la próxima vez.');
    }
}

viewMessage = (a, c) => `De acuerdo, ${a.Identificacion.Nombre} ${a.Identificacion.Apellido}. La solicitud de ${c.Motivo} de tu asistencia del ${c.Fecha} es de ${c.Hora}.`;