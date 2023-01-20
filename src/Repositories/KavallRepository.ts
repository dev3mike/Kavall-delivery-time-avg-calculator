import 'reflect-metadata';

import moment from 'moment';
import { Inject, Service } from 'typedi';

import { KavallDeliveriesStatsItemDto } from '../Dtos/KavallDeliveriesStatsItemDto';
import { KavallRepositoryInterface } from '../Interfaces/KavallRepositoryInterface';
import { HttpClientService } from '../Services/HttpClientService';

@Service()
export class KavallRepository implements KavallRepositoryInterface {

    private baseUrl = "https://europe-west3-getgaston-test.cloudfunctions.net";

    constructor(
        @Inject()
        private readonly httpClientService : HttpClientService
    ){}

    getDeliveriesStatsByDateAsync(date: Date): Promise<KavallDeliveriesStatsItemDto[]> {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        return this.httpClientService.getRequestAsync<KavallDeliveriesStatsItemDto[]>(this.baseUrl + `/hometestDeliveries?date=${formattedDate}`);
    }

}