import connection from '../database';
import bcrypt from 'bcrypt';
class UsersService {
    static async create(id, password) {
        const userData = {
            id, password
        };
       return connection.query('INSERT INTO users SET ?', userData);
    }
    static async findById(id) {
        const rows = await connection.query(`SELECT * FROM users WHERE id = '${id}' LIMIT 1`);
        if (rows.length) {
            return rows[0];
        }
    }

    static async signIn(id, password) {
        const userFromDB = await UsersService.findById(id);
        if (!userFromDB) {
            throw new Error(`User with id ${id} does not exist`);
        }

        const hashedPasswordFromDB = await userFromDB.password;
        const isPasswordsMatch = await bcrypt.compare(password, hashedPasswordFromDB);
        if (!isPasswordsMatch) {
            throw new Error('Wrong id or password');
        }
        return userFromDB;
    }

    static async signUp(id, password) {
        const userFromDB = await UsersService.findById(id);
        if (userFromDB) {
            throw new Error(`User with id ${id} already exist`);
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await UsersService.create(id, hashedPassword);
    }
}
export default UsersService;
