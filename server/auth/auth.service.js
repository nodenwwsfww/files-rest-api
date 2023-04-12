import jwt from 'jsonwebtoken';
import config from '../users/users.config';
import connection from '../database';

/* Authentication
* Responsible for JWT Tokens */
class AuthService {
    static async auth(id, res) {
        const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: config.maxBearerTokenLifeTime });
        const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: config.maxRefreshTokenLifeTime });

        res.cookie('access_token', accessToken, { httpOnly: true });

        const isRefreshTokenExist = await this.findById(id);
        const refreshTokenData = {
            user_id: id,
            token: refreshToken,
            created_at: new Date()
        };
        if (isRefreshTokenExist) {
            console.log('Token exist');
            await connection.query('UPDATE refresh_tokens SET ? WHERE user_id = ?', [refreshTokenData, refreshTokenData.user_id]);
        } else {
            console.log('Token not exist');
            await connection.query('INSERT INTO refresh_tokens SET ?', refreshTokenData);
        }
        // Send the token as a bearer token in the response
        return {access_token: accessToken, refresh_token: refreshToken};
    }
    static async logout(res) {
        res.clearCookie('access_token');
    }

    static async findById(id) {
        const rows = await connection.query(`SELECT * FROM refresh_tokens WHERE user_id = '${id}' LIMIT 1`);
        if (rows.length) {
            return rows[0];
        }
    }
    static async getUpdatedAccessToken(res, id) {
        const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: config.maxBearerTokenLifeTime });
        res.cookie('access_token', accessToken, { httpOnly: true });

        return accessToken;
    }
}
export default AuthService;
