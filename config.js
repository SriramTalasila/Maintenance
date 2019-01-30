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
    email:'ram98.sri98@gmail.com',
    password:'Ram@7382024589'
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
