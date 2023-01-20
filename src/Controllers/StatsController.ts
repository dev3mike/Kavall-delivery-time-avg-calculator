import { Controller, Get } from '@overnightjs/core';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { Inject, Service } from 'typedi';

import { DeliveriesStatsDto } from '../Dtos/DeliveriesStatsDto';
import { DeliveryStatsService } from '../Services/DeliveryStatsService';


@Service({transient: false})
@Controller("stats")
export class StatsController{

    constructor(
        @Inject()
        private readonly deliveryStatsService : DeliveryStatsService
    ){}

    /**
     * Fetch stats for all deliveries
     * @returns {DeliveriesStatsDto}
     */
    @Get("deliveries")
    private async GetDeliveriesStats(req: Request, res: Response, next: NextFunction){

        try{

            const {startDate, endDate} = req.query as {startDate: string, endDate: string};
            assertStartDateAndEndDateIsValid(startDate, endDate);
            
            const startDateAsDate = new Date(startDate);
            const endDateAsDate = new Date(endDate);

            const storeAverages = await this.deliveryStatsService.getDeliveryAveragesByDateRangeAsync(startDateAsDate, endDateAsDate);
            
            const response : DeliveriesStatsDto = {
                timePeriod: [startDate, endDate],
                storeAverages: storeAverages
            };
            res.status(200).json(response);

        }catch(error){
            next(error);
        }
    }
}

function assertStartDateAndEndDateIsValid(startDate: string, endDate: string) {
    if(!moment(startDate, "YYYY-MM-DD", true).isValid() || !moment(endDate, "YYYY-MM-DD", true).isValid())
        throw new Error("startDate or endDate is invalid");

    if(!moment(endDate).isAfter(startDate))
        throw new Error("startDate and endDate are not in the valid range");

    const todayDate = new Date();
    if(moment(startDate).isAfter(todayDate) || moment(endDate).isAfter(todayDate))
        throw new Error("Are you looking for something in future ?!");
}
