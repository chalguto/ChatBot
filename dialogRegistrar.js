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
        console.log('Dialogo --> *** GUARDAR ***');

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
        console.log('Dialogo --> *** GUARDAR ***. Respuesta');

        //Get Identificacion
        new AsistenciaEmpleadoBLL().AsistenciaEmpleado_Select(new entIdentificacion(results.response))
            .then(res => {

                //Crea el objeto
                let asistir = new entLUISAsistencia(session.dialogData.intent, session.dialogData.typeEntity);
                asistir.Identificacion = new entIdentificacion(res);
                session.userData.asistencia = asistir;

                //Crea la Asistencia
                CrearAsistencia(session, asistir);
            });
    }
];

//Se crea el registro de la asistencia
CrearAsistencia = (session, asistir) => {
    if (asistir.Identificacion != '' && asistir.Identificacion != undefined) {

        //Obtiene la Fecha/Hora para realizar el registro
        let wrapped = moment();
        asistir.Fecha = moment(wrapped).format('DD/MM/YYYY');
        asistir.Hora = wrapped.format('HH:mm:ss');

        //LUIS indica la operacion que se va a realizar        
        new clsLUISforDB().ResponseLUIS(`${session.dialogData.intent} ${session.dialogData.typeEntity}`)
            .then(resLUIS => {

                //De acuerdo a la respuesta de LUIS, se realiza la operacion
                new clsForBusiness(resLUIS.topScoringIntent.intent,
                        resLUIS.entities[0].entity,
                        new entAsistencia(asistir, resLUIS.topScoringIntent.intent))
                    .Business;

                //Muestra el mensaje de registro
                session.endDialog(viewMessage(asistir, resLUIS));

                session.userData.asistencia = {};
                console.log("inicializando userData.asistencia para manejar la Asistencia");
            });
    } else {
        session.endDialog('De acuerdo, asegúrete de ingresar correctamente su identificación o intenta la próxima vez.');
    }
}

viewMessage = (a, L) => `De acuerdo, ${a.Identificacion.Nombre} ${a.Identificacion.Apellido}. La solicitud de ${L.topScoringIntent.intent} tu asistencia del ${a.Fecha} es a las ${a.Hora} hrs.`;