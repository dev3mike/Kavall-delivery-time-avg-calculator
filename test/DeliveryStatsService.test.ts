import NodeCache from 'node-cache';
import Container from 'typedi';

import { HttpClientServiceInterface } from '../src/Interfaces/HttpClientServiceInterface';
import { KavallRepository } from '../src/Repositories/KavallRepository';
import { DeliveryStatsService } from '../src/Services/DeliveryStatsService';
import { HttpClientService } from '../src/Services/HttpClientService';

describe('DeliveryStatsService test', () => {
    it('When we dont have data on api, delivery averages should return an empty array', async () => {
        // Arrange
        class MockedHttpClientService implements HttpClientServiceInterface {
            getRequestAsync<T>(url: string): Promise<T> {
                return Promise.resolve([] as T);
            }
        }
        Container.reset();
        Container.set('data-cache', new NodeCache({ stdTTL: 1 }));
        Container.set(HttpClientService, new MockedHttpClientService());

        const deliveryStatsService = new DeliveryStatsService(Container.get(KavallRepository));
        const startDate = new Date(2021, 1, 1);
        const endDate = new Date(2021, 1, 2);

        // Act
        const deliveryAverages = await deliveryStatsService.getDeliveryAveragesByDateRangeAsync(startDate, endDate);

        // Assert
        expect(deliveryAverages).toStrictEqual([]);
    });


    it('Validate average calculation logic', async () => {
        // Arrange
        class MockedHttpClientService implements HttpClientServiceInterface {
            getRequestAsync<T>(url: string): Promise<T> {
                return Promise.resolve([{
                        orderId: 1,
                        storeId: 1,
                        date: "2021-01-02",
                        seconds: 100
                    },
                    {
                        orderId: 2,
                        storeId: 1,
                        date: "2021-01-02",
                        seconds: 200
                    }] as T);
            }
        }
        Container.reset();
        Container.set('data-cache', new NodeCache({ stdTTL: 1 }));
        Container.set(HttpClientService, new MockedHttpClientService());

        const deliveryStatsService = new DeliveryStatsService(Container.get(KavallRepository));
        const startDate = new Date(2021, 1, 1);
        const endDate = new Date(2021, 1, 2);

        // Act
        const deliveryAverages = await deliveryStatsService.getDeliveryAveragesByDateRangeAsync(startDate, endDate);

        // Assert
        expect(deliveryAverages[0].averageSeconds).toBe(150);
    });


    it('Validate group by storeId logic', async () => {
        // Arrange
        class MockedHttpClientService implements HttpClientServiceInterface {
            getRequestAsync<T>(url: string): Promise<T> {
                return Promise.resolve([{
                        orderId: 1,
                        storeId: 1,
                        date: "2021-01-02",
                        seconds: 100
                    },
                    {
                        orderId: 2,
                        storeId: 2,
                        date: "2021-01-02",
                        seconds: 200
                    },
                    {
                        orderId: 3,
                        storeId: 2,
                        date: "2021-01-02",
                        seconds: 200
                    }] as T)
                    ;
            }
        }
        Container.reset();
        Container.set('data-cache', new NodeCache({ stdTTL: 1 }));
        Container.set(HttpClientService, new MockedHttpClientService());

        const deliveryStatsService = new DeliveryStatsService(Container.get(KavallRepository));
        const startDate = new Date(2021, 1, 1);
        const endDate = new Date(2021, 1, 2);

        // Act
        const deliveryAverages = await deliveryStatsService.getDeliveryAveragesByDateRangeAsync(startDate, endDate);

        // Assert
        expect(deliveryAverages.length).toBe(2);
    });

    
    it('Validate remove duplicate order ids logic', async () => {
        // Arrange
        class MockedHttpClientService implements HttpClientServiceInterface {
            getRequestAsync<T>(url: string): Promise<T> {
                return Promise.resolve([{
                        orderId: 1,
                        storeId: 1,
                        date: "2021-01-02",
                        seconds: 100
                    },
                    {
                        orderId: 2,
                        storeId: 2,
                        date: "2021-01-02",
                        seconds: 200
                    },
                    {
                        orderId: 2,
                        storeId: 2,
                        date: "2021-01-02",
                        seconds: 200
                    }] as T)
                    ;
            }
        }
        Container.reset();
        Container.set('data-cache', new NodeCache({ stdTTL: 1 }));
        Container.set(HttpClientService, new MockedHttpClientService());

        const deliveryStatsService = new DeliveryStatsService(Container.get(KavallRepository));
        const startDate = new Date(2021, 1, 1);
        const endDate = new Date(2021, 1, 2);

        // Act
        const deliveryAverages = await deliveryStatsService.getDeliveryAveragesByDateRangeAsync(startDate, endDate);

        // Assert
        expect(deliveryAverages[1].averageSeconds).toBe(200);
    });

    
    it('Validate deliveries sum logic', async () => {
        // Arrange
        class MockedHttpClientService implements HttpClientServiceInterface {
            getRequestAsync<T>(url: string): Promise<T> {
                return Promise.resolve([{
                        orderId: 1,
                        storeId: 1,
                        date: "2021-01-02",
                        seconds: 100
                    },
                    {
                        orderId: 2,
                        storeId: 1,
                        date: "2021-01-02",
                        seconds: 200
                    },
                    {
                        orderId: 3,
                        storeId: 1,
                        date: "2021-01-02",
                        seconds: 200
                    }] as T)
                    ;
            }
        }
        Container.reset();
        Container.set('data-cache', new NodeCache({ stdTTL: 1 }));
        Container.set(HttpClientService, new MockedHttpClientService());

        const deliveryStatsService = new DeliveryStatsService(Container.get(KavallRepository));
        const startDate = new Date(2021, 1, 1);
        const endDate = new Date(2021, 1, 2);

        // Act
        const deliveryAverages = await deliveryStatsService.getDeliveryAveragesByDateRangeAsync(startDate, endDate);

        // Assert
        expect(deliveryAverages[0].deliveries).toBe(3);
    });
  });