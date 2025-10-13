export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PUBLIC_URL: process.env.PUBLIC_URL || '',
  REACT_APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
} as const;

export const isDevelopment = ENV.NODE_ENV === 'development';
export const isProduction = ENV.NODE_ENV === 'production';
