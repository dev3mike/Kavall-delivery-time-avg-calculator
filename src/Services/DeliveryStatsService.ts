import moment from 'moment';
import NodeCache from 'node-cache';
import Container, { Inject, Service } from 'typedi';

import { StoreAverageDto } from '../Dtos/DeliveriesStatsDto';
import { KavallDeliveriesStatsItemDto } from '../Dtos/KavallDeliveriesStatsItemDto';
import { ArrayHelper } from '../Helpers/ArrayHelper';
import { DeliveryStatsServiceInterface } from '../Interfaces/DeliveryStatsServiceInterface';
import { KavallRepository } from '../Repositories/KavallRepository';

@Service({transient: false})
export class DeliveryStatsService implements DeliveryStatsServiceInterface {

    constructor(
        @Inject()
        private readonly kavallRepository: KavallRepository
    ){}

    async getDeliveryAveragesByDateRangeAsync(startDate: Date, endDate: Date): Promise<StoreAverageDto[]> {

        const deliveriesData = await this.getDeliveriesDataAsync(startDate, endDate);
        if(deliveriesData.length == 0) return [];

        const dataGroupedByStoreId = ArrayHelper.groupByStoreId(deliveriesData);
        
        const storeDeliveriesAverage = [] as StoreAverageDto[];
        for (const [storeId, valueObjectArray] of Object.entries(dataGroupedByStoreId)) {
            const storeObjectArray = valueObjectArray as KavallDeliveriesStatsItemDto[];
            const average = this.sumOfAllDeliverySeconds(storeObjectArray) / storeObjectArray.length;

            storeDeliveriesAverage.push(
                {
                    storeId: +storeId,
                    deliveries: storeObjectArray.length,
                    averageSeconds: average
                }
            );
        }
        return storeDeliveriesAverage;
    }

    private sumOfAllDeliverySeconds(storeObjectArray: KavallDeliveriesStatsItemDto[]) : number {
        let sum = 0;
        // We can use reduce but 'for loop' is more efficient
        for(var i = 0; i < storeObjectArray.length; i++)
            sum = sum + storeObjectArray[i].seconds;
        
        return sum;
    }

    private async getDeliveriesDataAsync(startDate: Date, endDate: Date){
        const promises : Array<Promise<KavallDeliveriesStatsItemDto[]>> = [];

        for (var date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            promises.push(this.getDataFromCacheOrRepositoryAsync(date))
        }

        const dataArray = await Promise.all(promises);

        const flattedArray = dataArray.flat();
        return ArrayHelper.removeDuplicateOrderIds(flattedArray) as KavallDeliveriesStatsItemDto[];
    }

    private async getDataFromCacheOrRepositoryAsync(date: Date) : Promise<KavallDeliveriesStatsItemDto[]>{
        const cacheKey = moment(date).toString();
        const cacheInstance = Container.get<NodeCache>('data-cache');
        const cache = cacheInstance.get<[KavallDeliveriesStatsItemDto]>(cacheKey);

        if(cache)
            return cache;
        
        const response = await this.kavallRepository.getDeliveriesStatsByDateAsync(date);
        cacheInstance.set(cacheKey, response);
        return response;
    }
}
