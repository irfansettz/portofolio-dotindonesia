const AuthenticationsHanlder = require("./handler")
const routes = require('./routes');

module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: async (server, {
        authenticationService,
        usersService,
        tokenManager,
        validator
    }) => {
        const authenticationHandler = new AuthenticationsHanlder(authenticationService, usersService, tokenManager, validator);
        server.route(routes(authenticationHandler));
    }
}