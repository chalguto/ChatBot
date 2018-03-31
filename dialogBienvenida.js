module.exports = [
    function(session) {
        session.send("Puedo registrar hora de llegada y salida, mostrar horas de trabajo y mostrar última fecha de ingreso.");
        console.log('Dialogo --> *** SALUDAR ***');
        // Inicializa el Objeto en el Chat
        if (!session.userData.asistencia) {
            session.userData.asistencia = {};
            console.log("inicializando userData.asistencia para manejar la Asistencia");
        }
        session.endDialog("");
    }
];