import { Inject } from 'typedi';

import { Configuration } from '../Configuration/Configuration';
import { WebServer } from './WebServer';

export class Start {
    constructor(
        @Inject()
        private readonly webServer: WebServer
        )
    {
        const serverPort = process.env.PORT || Configuration.SERVER_PORT;
        webServer.start(serverPort)
            .then(() => {
                console.log(`Server started successfully. PORT = ${serverPort}`);
            })
            .catch(err => {
                console.log("The server could not be started", err);
            });    
    }
}