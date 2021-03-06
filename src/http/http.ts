import { Middleware } from 'kinvey-js-sdk/dist/request';
import { request as HttpRequest } from 'http';
import { device } from 'platform'
const pkg = require('../../package.json');

function deviceInformation() {
  const platform = device.os;
  const version = device.osVersion;
  const manufacturer = device.manufacturer;
  const parts = [`js-${pkg.name}/${pkg.version}`];

  return parts.concat([platform, version, manufacturer]).map((part) => {
    if (part) {
      return part.toString().replace(/\s/g, '_').toLowerCase();
    }

    return 'unknown';
  }).join(' ');
}

export class HttpMiddleware extends Middleware {
  constructor(name = 'Http Middleware') {
    super(name);
  }

  handle(request: any) {
    const { url, method, headers, body, timeout, followRedirect } = request;
    headers['X-Kinvey-Device-Information'] = deviceInformation();
    const options = {
      method: method,
      headers: headers,
      url: encodeURI(url),
      content: body,
      timeout: timeout,
      dontFollowRedirects: followRedirect
    };
    return (HttpRequest(options) as any)
      .then((response) => {
        return {
          response: {
            statusCode: response.statusCode,
            headers: response.headers,
            data: response.content.toString()
          }
        };
      });
  }

  cancel() {
    return Promise.resolve();
  }
}
