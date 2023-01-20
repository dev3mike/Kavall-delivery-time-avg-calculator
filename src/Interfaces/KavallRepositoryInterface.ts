import { KavallDeliveriesStatsItemDto } from '../Dtos/KavallDeliveriesStatsItemDto';

export interface KavallRepositoryInterface {
    /**
     * Get list of all delivery stats from Kavall by date
     * @param date 
     */
    getDeliveriesStatsByDateAsync(date: Date) : Promise<KavallDeliveriesStatsItemDto[]>;
}