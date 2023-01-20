import { StoreAverageDto } from '../Dtos/DeliveriesStatsDto';

export interface DeliveryStatsServiceInterface {
    /**
     * Get stores delivery averages by date range
     * @param startDate Start date
     * @param endDate End date
     * @returns {[StoreAverageDto]}
     */
    getDeliveryAveragesByDateRangeAsync(startDate: Date, endDate: Date): Promise<StoreAverageDto[]>;
}