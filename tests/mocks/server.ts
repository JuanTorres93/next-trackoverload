import { setupServer } from 'msw/node';

import { http, HttpResponse, PathParams } from 'msw';

type HandlerConfig = {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  response: (info: {
    request: Request;
    params: PathParams;
    cookies: Record<string, string>;
  }) => unknown;
};

export function createServer(handlersConfig: HandlerConfig[]) {
  const handlers = handlersConfig.map((config) => {
    return http[config.method || 'get'](config.path, (info) => {
      // DOC: info.params: string | string[] | undefined
      return HttpResponse.json(
        config.response(info) as Record<string, unknown>
      );
    });
  });

  const server = setupServer(...handlers);

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
