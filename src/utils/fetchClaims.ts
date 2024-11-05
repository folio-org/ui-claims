import { CLAIMS_API } from '../constants';
import {
  HTTPClient,
  HTTPClientOptions,
} from '../typing';

export const fetchClaims = <T>(httpClient: HTTPClient) => (options: HTTPClientOptions): Promise<T> => {
  return httpClient.get(CLAIMS_API, options).json<T>();
};
