// src/config/env.config.ts
import * as Joi from 'joi';

// Esta función cargará las variables de entorno.
export const EnvConfiguration = () => ({
  //? DB Envs
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_USER: process.env.DB_USER,
  //? Email Envs
  EMAIL_ENABLED: process.env.EMAIL_ENABLED === 'true',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
  //? App Envs
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  //? Others
  FRONTEND_URL: process.env.FRONTEND_URL,
  COMPANY_NAME: process.env.COMPANY_NAME,
});

// Esquema de validación con Joi.
export const envValidationSchema = Joi.object({
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_USER: Joi.string().required(),
  EMAIL_ENABLED: Joi.boolean().default(true),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.string().required(),
  EMAIL_SECURE: Joi.boolean().default(false),
  NODE_ENV: Joi.string().default('dev'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.number().default(3600),
  FRONTEND_URL: Joi.string(),
  COMPANY_NAME: Joi.string().default('Company_name'),
});
