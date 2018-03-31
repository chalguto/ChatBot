const DocumentDBClient = require('documentdb').DocumentClient;

module.exports = class DocDBUtils {
    constructor() {}

    getOrCreateDatabase(client, databaseId, callback) {
        let querySpec = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters: [{
                name: '@id',
                value: databaseId
            }]
        };

        client.queryDatabases(querySpec).toArray((err, results) => {
            if (err) {
                callback(err);
            }

            if (!err && results.length === 0) {
                client.createDatabase({
                    id: databaseId
                }, (err, created) => {
                    callback(null, created);
                });
            } else {
                callback(null, results[0]);
            }
        });
    }

    getOrCreateCollection(client, databaseLink, collectionId, callback) {
        let querySpec = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters: [{
                name: '@id',
                value: collectionId
            }]
        };

        client.queryCollections(databaseLink, querySpec).toArray((err, results) => {
            if (err) {
                callback(err);
            }

            if (!err && results.length === 0) {
                client.createCollection(databaseLink, {
                    id: collectionId
                }, (err, created) => {
                    callback(null, created);
                });
            } else {
                callback(null, results[0]);
            }
        });
    }
}