export interface DeliveriesStatsDto {
    timePeriod: [string, string],
    storeAverages: StoreAverageDto[]
}

export interface StoreAverageDto {
    storeId: number,
    deliveries: number,
    averageSeconds: number
}