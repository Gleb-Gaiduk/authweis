import * as Joi from 'joi';
import { ISignUpReqDTO } from 'src/interfaces';

const passwordRegex = '^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$';

const signUpSchema = Joi.object<ISignUpReqDTO, true>({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(36)
    .pattern(new RegExp(passwordRegex))
    .required(),
}).options({
  abortEarly: false,
});

export { signUpSchema };
