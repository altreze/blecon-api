var config            = {};

config.jwt            = {};
config.jwt.key        = 'jwt.key';
config.jwt.secret     = process.env.jwt_secret;
config.jwt.issuer     = 'altreze.ma';
config.jwt.expires    = 14400; // Expires in 4 hours

config.session        = {};
config.session.key    = 'aluminium.key';
config.session.secret = process.env.session_secret;

module.exports        = config;