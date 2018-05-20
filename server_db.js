const MongoClient = require('mongodb').MongoClient;
const f = require('util').format;

module.exports = class {

    constructor(){

    }

    async connect(config){
        return new Promise((resolve)=> {
            const url = f('mongodb://%s:%s@%s:27017/?authMechanism=%s&authSource=%s',
                config.mongo.username,
                config.mongo.password,
                config.mongo.host,
                config.mongo.auth_mechanism,
                config.mongo.db);

            MongoClient.connect(url, {useNewUrlParser:true},(err, client)=>{
                if(err){
                    console.log(err);
                    throw err;
                }

                this.client = client;
                this.db = client.db(config.mongo.db);

                console.log('connected to db');
                resolve();
            });
        });
    }

    query(queryStr,params=[]){
        return new Promise((resolve, reject)=>{
            this.pool.query(queryStr, params, function (error, results, fields) {
                if (error){
                    console.log(error);
                    reject(error);
                }else{
                    resolve(results, fields);
                }
            });
        });
    }

    async getLastBlock(){
        return await this.db.collection('blocks').find().sort({block_id:-1}).limit(1).toArray();
    }

    async getBlockByNum(num){
        return await this.db.collection('blocks').find({block_id:{$eq:num}}).limit(1).toArray().then(x => x[0]);
    }

    async deleteBlocksStartingAt(start){
        await this.db.collection('blocks').remove({block_id:{$gte:start}});
        await this.db.collection('assets').remove({block_id:{$gte:start}});
        await this.db.collection('contracts').remove({block_id:{$gte:start}});
    }

    async insertBlock(block){
        return await this.db.collection('blocks').insert(block);
    }

    async insertAsset(asset){
        return await this.db.collection('assets').insert(asset);
    }

    async insertContracts(contracts){
        return await this.db.collection('contracts').insert(contracts);
    }

    async getAccounts(accounts){


    }

}