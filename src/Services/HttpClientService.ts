import axios from 'axios';
import { Service } from 'typedi';

import { HttpClientServiceInterface } from '../Interfaces/HttpClientServiceInterface';

@Service()
export class HttpClientService implements HttpClientServiceInterface {
    async getRequestAsync<T>(url: string): Promise<T> {
        try{
            
            const { data } = await axios.get<T>( url, {headers: {Accept: 'application/json'}});
            return data;

        }catch(error: any){
            this.handleError(error);
        }
    }

    private handleError(error: any){
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            throw new Error(error.message);
        } else {
            console.log('unexpected error: ', error);
            throw new Error('An unexpected error occurred');
        }
    }


}