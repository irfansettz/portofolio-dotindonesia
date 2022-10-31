const ClientError = require("../../exceptions/ClientError");

class AuthenticationsHanlder {
    constructor(authenticationService, usersService, tokenManager, validator) {
        this._authenticationService = authenticationService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    }

    async postAuthenticationHandler(request, h) {
        try {
            this._validator.validatePostAuthenticationPayload(request.payload);
            const {
                username,
                password
            } = request.payload;
            const id = await this._usersService.verifyUserCredential(username, password);
            const accessToken = await this._tokenManager.generateAccessToken({
                id
            });
            const refreshToken = await this._tokenManager.generateRefreshToken({
                id
            });

            await this._authenticationService.addRefreshToken(refreshToken);

            const response = h.response({
                status: 'success',
                data: {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }

            // server error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async putAuthenticationHandler(request, h) {
        try {
            this._validator.validatePutAuthenticationPayload(request.payload);

            const {
                refreshToken
            } = request.payload;
            await this._authenticationService.verifyRefreshToken(refreshToken);
            const {
                id
            } = this._tokenManager.verifyRefreshToken(refreshToken);

            const accessToken = this._tokenManager.generateAccessToken({
                id
            })

            const response = h.response({
                status: 'success',
                data: {
                    accessToken: accessToken
                }
            });
            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }

            // server error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deleteAuthenticationHandler(request, h) {
        try {
            this._validator.validateDeleteAuthenticationPayload(request.payload);

            const {
                refreshToken
            } = request.payload;
            await this._authenticationService.verifyRefreshToken(refreshToken);
            await this._authenticationService.deleteRefresToken(refreshToken);

            const response = h.response({
                status: 'success',
                message: 'Refresh token berhasil dihapus'
            });
            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }

            // server error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = AuthenticationsHanlder;