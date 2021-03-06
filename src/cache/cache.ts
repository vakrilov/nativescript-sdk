import { CacheMiddleware as CoreCacheMiddleware } from 'kinvey-js-sdk/dist/request';
import KinveyStorage from 'kinvey-js-sdk/dist/request/src/middleware/src/storage';
import { SQLite } from './sqlite';

class Storage extends KinveyStorage {
  name: string;

  constructor(name: string) {
    super(name);
  }

  loadAdapter() {
    return SQLite.load(this.name);
  }
}

export class CacheMiddleware extends CoreCacheMiddleware {
  loadStorage(name) {
    return new Storage(name);
  }
}
