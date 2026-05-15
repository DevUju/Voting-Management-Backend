import * as dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_HOST: string;
      DATABASE_PORT: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN?: string;
      JWT_EXPIRATION?: string;
      JWT_REFRESH_SECRET?: string;
      JWT_REFRESH_EXPIRES_IN?: string;
      APP_PORT: string;
      FRONTEND_URL?: string;
      ADMIN_EMAIL: string;
      ADMIN_PASSWORD: string;
      ADMIN_NAME: string;
      ADMIN_STATE: string;
    }
  }
}
