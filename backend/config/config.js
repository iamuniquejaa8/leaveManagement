// prod config
const prodConfig = {
    port: 3000 || process.env.PORT,
    mongo_uri:  process.env.MONGO_URI,
}

const devConfig = {
    
}

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

module.exports = config;