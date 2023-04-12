import AuthService from './auth.service';

/* Authentication
* Responsible for JWT Tokens */
class AuthController {
    static async signinNewToken (req, res) {
        try {
            const accessToken = await AuthService.getUpdatedAccessToken(res, req.id);
            return res.status(200).json({access_token: accessToken});
        } catch (err) {
            return res.status(400).json({ errors: [err.message] });
        }
    }
    static async logout (req, res) {
        try {
            await AuthService.logout(res);
            return res.status(200).json({ message: 'Logged out successfully' });
        } catch (err) {
            return res.status(400).json({ errors: [err.message] });
        }
    }
}
export default AuthController;
