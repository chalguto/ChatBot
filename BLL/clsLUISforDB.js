"use strict";

// Loads the environment variables from the .env file
require('dotenv').load();

const LUISClient = require("../luis_sdk");
const appLUISClient = LUISClient({
    appId: process.env.APP_ID,
    appKey: process.env.APP_KEY,
    verbose: true
});

module.exports = class clsLUISforDB {
    constructor() {}

    ResponseLUIS(answer) {
        return new Promise((resolve, reject) => {
            appLUISClient.predict(answer, {
                //On success of prediction
                onSuccess: response => {
                    //printOnSuccess(response);
                    resolve(response);
                },
                //On failure of prediction
                onFailure: err => {
                    console.error(err);
                    reject(err);
                }
            });
        });
    }

    printOnSuccess(response) {
        console.log("Query: " + response.query);
        console.log("Top Intent: " + response.topScoringIntent.intent);
        console.log("Entities:");
        for (var i = 1; i <= response.entities.length; i++) {
            console.log(i + "- " + response.entities[i - 1].entity);
        }
        if (typeof response.dialog !== "undefined" && response.dialog !== null) {
            console.log("Dialog Status: " + response.dialog.status);
            if (!response.dialog.isFinished()) {
                console.log("Dialog Parameter Name: " + response.dialog.parameterName);
                console.log("Dialog Prompt: " + response.dialog.prompt);
            }
        }
    }
}