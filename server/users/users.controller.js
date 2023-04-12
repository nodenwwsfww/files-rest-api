import {validationResult} from 'express-validator';
import UsersService from './users.service';
import AuthService from '../auth/auth.service';
class UsersController {
    static async signup (req, res){
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {id, password} = req.body;
        try {
            await UsersService.signUp(id, password);
            const {access_token, refresh_token} = await AuthService.auth(id, res);
            return res.status(200).json({ access_token, refresh_token });
        } catch (err) {
            return res.status(400).json({ errors: [err.message] });
        }
    }
    static async signin (req, res) {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {id, password} = req.body;

        try {
            await UsersService.signIn(id, password);
            const {access_token, refresh_token} = await AuthService.auth(id, res);
            return res.status(200).json({ access_token, refresh_token });
        } catch (err) {
            return res.status(400).json({ errors: [err.message] });
        }
    }
    static async getUserInfo(req, res) {
        return res.status(200).json({ id: req.id });
    }
}
export default UsersController;
