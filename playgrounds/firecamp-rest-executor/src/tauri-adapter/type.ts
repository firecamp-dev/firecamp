import { InternalAxiosRequestConfig } from 'axios';

export interface IAuthorization {
  Authorization: string;
}

export interface ITauriAxiosRequestConfig extends InternalAxiosRequestConfig {
  jwt?: string;
}
