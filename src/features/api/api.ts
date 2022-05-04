import { Module, TNodeFunc } from "../module/module";

export type TEndpointNode = {
  get?: TNodeFunc
  create?: TNodeFunc
  update?: TNodeFunc
  delete?: TNodeFunc
  [key: string]:  TEndpointNode | TNodeFunc | ApiModule | undefined
}

export type TOptions<TClient = any> = { client?: TClient }

/**
 * API module.
 * @example
 * const module = new ApiModule(axios, { a: 1, b: 2 })
 * 
 * module.opt(() => ({ b: 3, c: 4 }))
 * module.opt(() => ({ d: 5, e: 6 }))
 * 
 * module.conf((opt, apiModule) => {
 *  opt.client.use(...)
 *  opt.client.use(...)
 * 
 *  apiModule.opt(() => ({ f: 7, j: 8 }))
 * })
 * 
 * module.conf((opt, apiModule) => {
 *  opt.client.interceptor(...)
 *  opt.client.interceptor(...)
 * 
 *  apiModule.opt(() => ({ f: 9, j: 10 }))
 * })
 * 
 * // register api endpoint with nested object api endpoint
 * module.register('users', {
 *  get: (id, apiOptions) => ({})
 *  create: (newObject, apiOptions) => ({})
 *  comment: {
 *    get: (id, apiOptions) => ({})
 *    create: (newObject, apiOptions) => ({})
 *    update: (id, newObject, apiOptions) => ({})
 *    delete: (id, apiOptions) => ({})
 *  }
 * })
 * 
 * // register api endpoint with composite key
 * module.register('users', {
 *  get: (id, apiOptions) => ({})
 *  create: (newObject, apiOptions) => ({})
 * })
 * module.register('users.comment', {
 *  get: (id, apiOptions) => ({})
 *  create: (newObject, apiOptions) => ({})
 *  update: (id, newObject, apiOptions) => ({})
 *  delete: (id, apiOptions) => ({})
 * })
 * 
 * // register api endpoint as submodule
 * const submodule = new Module({ a: 1, b: 2 })
 * submodule.register('get', (id, apiOptions) => ({}))
 * submodule.register('create', (newObject, apiOptions) => ({}))
 * submodule.register('update', (id, newObject, apiOptions) => ({}))
 * submodule.register('delete', (id, apiOptions) => ({}))
 * 
 * module.register('users.comment', submodule)
 * 
 * // register api endpoint without adding options into handlers
 * module.register('lodash', {
 *  get: (id, apiOptions) => ({})
 *  create: (newObject, apiOptions) => ({})
 * }, false)
 * 
 * 
 * // register api endpoints
 * module.registers({
 *  get: (id, apiOptions) => ({})
 *  create: (newObject, apiOptions) => ({})
 * })
 * 
 * // register api endpoints without adding options into handlers
 * module.registers({
 *  get: (id, apiOptions) => ({})
 *  create: (newObject, apiOptions) => ({})
 * }, false)
 * 
 * 
 * const [APIContext, useApi] = createModuleContext({
 *  defaultValue: null,
 *  displayName: 'DEBUG API NAME', // optional
 * })
 * 
 * const [apiService, options] = useApi()
 * 
 * apiService.users.create()
 * apiService.users.comment.get()
 * 
 */
export class ApiModule<Client = any, EndpointNode = TEndpointNode, Options extends object = {}> extends Module<EndpointNode, Options & TOptions<Client>>
{
  public constructor(
    client: Client,
    options: Options = {} as Options,
    ) {
    super({ ...options, client })
  }
}
