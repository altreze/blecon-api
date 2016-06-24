var config            = {};

config.jwt            = {};
config.jwt.key        = 'jwt.key';
config.jwt.secret     = process.env.jwt_secret;
config.jwt.issuer     = 'altreze.ma';
config.jwt.expires    = 3600; // Expires in 3600 seconds

config.session        = {};
config.session.key    = 'aluminium.key';
config.session.secret = process.env.session_secret;

module.exports        = config;