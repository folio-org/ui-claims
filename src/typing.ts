/* For some reason stripes-webpack can't resolve *.d.ts files during the build */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./global.d.ts" />

import { useOkapiKy } from '@folio/stripes/core';

export type HTTPClient = ReturnType<typeof useOkapiKy>;
export type HTTPClientOptions = Parameters<HTTPClient['extend']>[0];
export type HTTPClientSearchParams = HTTPClientOptions extends { searchParams?: infer S } ? S : never;
