import {body} from 'express-validator';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

export const passwordAndIdValidationChain = [
    body('id')
        .custom((value) => {
            if (!isEmail(value) && !isMobilePhone(value)) {
                throw new Error('Invalid email or phone number');
            }
            return true;
        }), body('password').isAlphanumeric(),
    body('password').isLength({min: 6, max: 32})
];
