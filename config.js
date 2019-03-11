const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
 app: {
   port: 3000
 },
 db: {
   host: 'localhost',
   port: 27017,
   name: 'maintenance'
 },
 smtp:{
    user:'apikey',
    password:'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'
 }
};

const test = {
 app: {
   port: 3000
 },
 db: {
   host: 'localhost',
   port: 27017,
   name: 'test'
 }
};

const config = {
 dev,
 test
};

module.exports = config;
