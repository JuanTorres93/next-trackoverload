import { setupServer } from 'msw/node';

import { http, HttpResponse } from 'msw';

type HandlerConfig = {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  response: any;
};

export function createServer(handlersConfig: HandlerConfig[]) {
  const handlers = handlersConfig.map((config) => {
    return http[config.method || 'get'](config.path, (req, res, ctx) => {
      return HttpResponse.json(config.response(req, res, ctx));
    });
  });

  const server = setupServer(...handlers);

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
