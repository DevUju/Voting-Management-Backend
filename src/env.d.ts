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
      JWT_EXPIRATION: string;
      APP_PORT: string;
      FRONTEND_URL?: string;
    }
  }
}
