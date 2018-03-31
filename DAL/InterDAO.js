const DocumentDBClient = require('documentdb').DocumentClient,
    docUtils = require('./docdbUtils');

var docdbUtils = new docUtils();

module.exports = class InterDAO {
    constructor(documentDBClient, databaseId, collectionId) {
        this.client = documentDBClient;
        this.databaseId = databaseId;
        this.collectionId = collectionId;

        this.database = null;
        this.collection = null;
    }

    init() {
        return new Promise((resolve, reject) => {
            docdbUtils.getOrCreateDatabase(this.client, this.databaseId, (err, db) => {
                if (err) reject(err)
                else {
                    this.database = db;
                    resolve(this.getOrCreateCollection());
                }
            });
        });
    }

    getOrCreateCollection() {
        return new Promise((resolve, reject) => {
            docdbUtils.getOrCreateCollection(this.client, this.database._self, this.collectionId, (err, coll) => {
                if (err) reject(err)
                else {
                    this.collection = coll;
                    resolve(this);
                }
            });
        });
    }

    addItem(item) {
        return new Promise((resolve, reject) => {
            this.client.createDocument(this.collection._self, item, (err, doc) => {
                if (err) reject(err)
                else resolve(true)
            });
        });
    }

    getItem(itemId) {
        return new Promise((resolve, reject) => {
            let querySpec = {
                query: 'SELECT * FROM root r WHERE r.id = @id',
                parameters: [{
                    name: '@id',
                    value: itemId
                }]
            };

            this.client.queryDocuments(this.collection._self, querySpec)
                .toArray((err, results) => {
                    if (err) reject(err)
                    else resolve(results[0])
                });
        });
    }

    getItemCondition(querySpec) {
        return new Promise((resolve, reject) => {
            this.client.queryDocuments(this.collection._self, querySpec)
                .toArray((err, results) => {
                    if (err) reject(err)
                    else resolve(results)
                });
        });
    }
}