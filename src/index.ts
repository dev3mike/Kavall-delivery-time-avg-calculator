// Enable runtime reflection on types.
import 'reflect-metadata';

import NodeCache from 'node-cache';
import Container from 'typedi';

import { Configuration } from './Configuration/Configuration';
import { Start } from './Server/Start';
import { WebServer } from './Server/WebServer';

const cache = new NodeCache({ stdTTL: Configuration.DATA_CACHE_TTL })
Container.set('data-cache', cache);

new Start(Container.get(WebServer));