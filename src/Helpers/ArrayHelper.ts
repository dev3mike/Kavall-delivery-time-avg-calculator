import { KavallDeliveriesStatsItemDto } from '../Dtos/KavallDeliveriesStatsItemDto';

export const ArrayHelper = {
    groupByStoreId(dataArray: KavallDeliveriesStatsItemDto[]){
        return dataArray.reduce((group, item) => {
            const { storeId } = item;
            group[storeId] = group[storeId] ?? [];
            group[storeId].push(item);
            return group;
          }, {})
    },
    removeDuplicateOrderIds(array: KavallDeliveriesStatsItemDto[]){
        // We can use javascript functions like filter but using for is much faster
        const seen = {};
        let output = [];
        let arrayLength = array.length;
        let indexCount = 0;
        for(let i = 0; i < arrayLength; i++) {
             let orderId = array[i].orderId;
             if(seen[orderId] !== 1) {
                   seen[orderId] = 1;
                   output[indexCount++] = array[i];
             }
        }
        return output;
    }
}