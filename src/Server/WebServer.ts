import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import Container, { Service } from 'typedi';

import { StatsController } from '../Controllers/StatsController';

@Service({transient: false})
export class WebServer extends Server {

    constructor(){
        super(true);
        this.app.use(bodyParser.urlencoded({extended: true}))
        this.app.use(bodyParser.json())
        this.setupControllers();

        this.app.use((err, req, res, next) => {
            // Todo: Log err.stack somewhere?
            res.status(400).send({
                error: err.message
            });
        })
    }

    public start(portNumber: string): Promise<any>{
        return new Promise<any>((resolve, reject) => {
            this.app.listen(portNumber, () => {
              resolve(portNumber);
            });
        });
    }

    private setupControllers(){

        const controllers = [
            Container.get(StatsController)
        ];

        super.addControllers(controllers);
    }
}

