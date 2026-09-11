import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const getEnvVariable = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`CRITICAL CONFIGURATION ERROR: The required environment variable '${key}' is missing!`);
    }
    return value;
};

export const ENV = {
    baseUrl: getEnvVariable('TOOLSHOP_BASE_URL'),
    apiUrl: getEnvVariable('TOOLSHOP_API_URL'),
    admin: {
        email: getEnvVariable('TOOLSHOP_ADMIN_EMAIL'),
        password: getEnvVariable('TOOLSHOP_ADMIN_PASSWORD'),
    }
};
