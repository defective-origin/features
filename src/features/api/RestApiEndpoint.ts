import { isNumber, isObject, isString, merge } from "lodash-es"

export type ID = number | string
export type TFetchOptions = RequestInit & { postfix?: string }
export type TRestApiEndpointRequestOptions = TFetchOptions | (() => TFetchOptions)
export type TPaginationOptions = {
  page: number | string
  count: number | string
}


export type TRestApiEndpointOptions = {
  postfixes?: boolean,
  sharedOptions?: TRestApiEndpointRequestOptions,
  custom?: {
    get?: TRestApiEndpointRequestOptions,
    create?: TRestApiEndpointRequestOptions,
    update?: TRestApiEndpointRequestOptions,
    delete?: TRestApiEndpointRequestOptions,
  }
}

export enum DefaultPostfixes {
  get = 'details',
  create = 'create',
  update = 'update',
  delete = 'delete',
}


/**
 * Request interface based on REST API architecture.
 * @example
 * const endpoint = new RestApiEndpoint('https://mysite')
 * 
 * // init endpoint with default fetch options for all requests
 * const endpoint = new RestApiEndpoint('https://mysite', { mode: 'cors', headers: { 'security-token': 'some-token' })
 * 
 * // init endpoint with getting postponed default fetch options for all requests
 * const endpoint = new RestApiEndpoint('https://mysite', () => ({ mode: 'cors', headers: { 'security-token': 'some-token' }))
 * 
 * // variables
 * const user = { id: '00000000-0000-0000-0000-000000000000', name: 'NEW NAME' }
 * const paginationOptions = { page: 4, count: 20 }
 * const customFetchOptions = { mode: 'cors', headers: { 'security-token': 'some-token' } }
 * 
 * // requests
 * endpoint.get() // get all records
 * endpoint.get(paginationOptions) // get several records on specific page
 * endpoint.get(user.id) // get record by id
 * endpoint.create(user)
 * endpoint.update(user.id, user)
 * endpoint.delete(user.id)
 * 
 * // requests with custom fetch options
 * endpoint.get(customFetchOptions) // get all records
 * endpoint.get(paginationOptions, customFetchOptions) // get several records on specific page
 * endpoint.get(user.id, customFetchOptions) // get record by id
 * endpoint.create(user, customFetchOptions)
 * endpoint.update(user.id, user, customFetchOptions)
 * endpoint.delete(user.id, customFetchOptions)
 * 
 * // request examples:
 * // GET      https://mysite/api/users   OR https://mysite/api/users/details
 * // GET      https://mysite/api/users/1 OR https://mysite/api/users/details/1
 * // PUT      https://mysite/api/users   OR https://mysite/api/users/create
 * // PATCH    https://mysite/api/users/1 OR https://mysite/api/users/update/1
 * // DELETE   https://mysite/api/users/1 OR https://mysite/api/users/delete/1
 */
export class RestApiEndpoint {
  constructor(
    private url: string,
    private options: TRestApiEndpointOptions = {},
  ) {}

  /**
   * Return fetch options.
   * 
   * @param options Clear options or function which returns options.
   * @returns Fetch options.
   */
  private getFetchOptions(options: TRestApiEndpointRequestOptions = {}): TFetchOptions {
    return typeof options === 'function' ? options() : options
  }

  /**
   * Combine options in correct order.
   * 
   * @param defaultOptions Endpoint default options.
   * @param customOptions Custom endpoint options which is got via constructor.
   * @param singleOptions Custom endpoint options which is got via call.
   * @returns Combined options.
   */
  private combineOptions(defaultOptions: TRestApiEndpointRequestOptions, customOptions: TRestApiEndpointRequestOptions = {}, singleOptions: TRestApiEndpointRequestOptions = {}) {
    const requestOptionList = [defaultOptions, this.options.sharedOptions || {}, customOptions, singleOptions] as const
    const fetchOptionList = requestOptionList.map((requestOption) => this.getFetchOptions(requestOption))

    return merge(...fetchOptionList as [TFetchOptions])
  }

  /**
   * Make fetch request.
   * 
   * @param options Fetch config options.
   * @param urlPayload ID or params which can be add to url string.
   * @returns Combined options.
   */
  private request(options: TFetchOptions, urlPayload?: ID | URLSearchParams) {
    const { postfix, ...init } = options

    return fetch(this.getUrl(postfix, urlPayload), init)
  }

  /**
   * Return url by id or with postfix.
   * @example
   * this.getUrl('postfix', '12345')
   * // 'https://mysite/api/users/postfix/12345'
   * 
   * @param postfix Part of url.
   * @param idOrSearchParams Record ID or Search params.
   * @returns Result url.
   */
  private getUrl(postfix?: string, idOrSearchParams?: ID | URLSearchParams) {
    const urlWithPostfix = this.options?.postfixes ? `${this.url}/${postfix}` : this.url
    const urlWithId = isNumber(idOrSearchParams) ? `${urlWithPostfix}/${idOrSearchParams}` : urlWithPostfix
    const urlWithSearchParams = isObject(idOrSearchParams) ? `${urlWithId}?${new URLSearchParams(idOrSearchParams)}` : urlWithId

    return urlWithSearchParams
  }

  /**
   * Make request for getting records.
   * @example
   * // variables
   * const user = { id: '00000000-0000-0000-0000-000000000000', name: 'NEW NAME' }
   * const paginationOptions = { page: 4, count: 20 }
   * const customFetchOptions = { mode: 'cors', headers: { 'security-token': 'some-token' } }
   * 
   * // requests
   * endpoint.get() // get all records
   * endpoint.get(paginationOptions) // get several records on specific page
   * endpoint.get(user.id) // get record by id
   * 
   * // requests with custom fetch options
   * endpoint.get(customFetchOptions) // get all records
   * endpoint.get(paginationOptions, customFetchOptions) // get several records on specific page
   * endpoint.get(user.id, customFetchOptions) // get record by id
   * 
   * 
   * @param idOrOptionsOrInit Record id or Pagination options or Fetch options.
   * @param init Options for fetch request.
   * @returns Promise with response.
   */
  public get(
    idOrOptionsOrInit: TRestApiEndpointRequestOptions | TPaginationOptions | ID = {},
    init?: TRestApiEndpointRequestOptions,
  ): Promise<Response> {
    const isFirstArgumentID = isString(idOrOptionsOrInit) || isNumber(idOrOptionsOrInit)
    const isFirstArgumentPaginationOptions = isObject(idOrOptionsOrInit) && 'page' in idOrOptionsOrInit
    const isFirstArgumentFetchOptions = !isFirstArgumentID && !isFirstArgumentPaginationOptions
    const fetchOptions = isFirstArgumentFetchOptions ? idOrOptionsOrInit : init
    const defaultOptions = { postfix: DefaultPostfixes.get, method: 'GET', headers: { 'Content-Type': 'application/json'  } }
    const options = this.combineOptions(defaultOptions, this.options.custom?.get, fetchOptions)

    // get record by id
    if (isFirstArgumentID) {
      return this.request(options, idOrOptionsOrInit)
    }

    // get records on specific page
    if (isFirstArgumentPaginationOptions) {
      const searchParams = new URLSearchParams({
        page: idOrOptionsOrInit.page.toString(),
        count: idOrOptionsOrInit.count.toString(),
      })

      return this.request(options, searchParams)
    }

    // get all records
    return this.request(options)
  }

  /**
   * Make request for creating record.
   * @example
   * // variables
   * const user = { id: '00000000-0000-0000-0000-000000000000', name: 'NEW NAME' }
   * const customFetchOptions = { mode: 'cors', headers: { 'security-token': 'some-token' } }
   * 
   * // create record
   * endpoint.create(user)
   * 
   * // create with custom fetch options
   * endpoint.create(user, customFetchOptions)
   * 
   * @param record Updated record.
   * @param init Options for fetch request.
   * @returns Promise with response.
   */
  public create(record: object, init?: TRestApiEndpointRequestOptions): Promise<Response> {
    const defaultOptions = { postfix: DefaultPostfixes.create, method: 'PUT', body: JSON.stringify(record), headers: { 'Content-Type': 'application/json'  } }
    const options = this.combineOptions(defaultOptions, this.options.custom?.create, init)

    return this.request(options)
  }

  /**
   * Make request for updating record.
   * @example
   * const user = { id: '00000000-0000-0000-0000-000000000000', name: 'NEW NAME' }
   * const customFetchOptions = { mode: 'cors', headers: { 'security-token': 'some-token' } }
   * 
   * // update record
   * endpoint.update(user.id, user)
   * 
   * // update with custom fetch options
   * endpoint.update(user.id, user, customFetchOptions)
   * 
   * @param id Record id.
   * @param record Updated record.
   * @param init Options for fetch request.
   * @returns Promise with response.
   */
  public update(id: ID, record: object, init?: TRestApiEndpointRequestOptions): Promise<Response> {
    const defaultOptions = { postfix: DefaultPostfixes.update, method: 'PATCH', body: JSON.stringify(record), headers: { 'Content-Type': 'application/json'  } }
    const options = this.combineOptions(defaultOptions, this.options.custom?.update, init)

    return this.request(options, id)
  }

  /**
   * Make request for deleting record.
   * @example
   * const user = { id: '00000000-0000-0000-0000-000000000000', name: 'NEW NAME' }
   * const customFetchOptions = { mode: 'cors', headers: { 'security-token': 'some-token' } }
   * 
   * // delete record
   * endpoint.delete(user.id)
   * 
   * // delete with custom fetch options
   * endpoint.delete(user.id, customFetchOptions)
   * 
   * @param id Record id.
   * @param init Options for fetch request.
   * @returns Promise with response.
   */
  public delete(id: ID, init?: TRestApiEndpointRequestOptions): Promise<Response> {
    const defaultOptions = { postfix: DefaultPostfixes.delete, method: 'DELETE', headers: { 'Content-Type': 'application/json'  } }
    const options = this.combineOptions(defaultOptions, this.options.custom?.delete, init)

    return this.request(options, id)
  }
}
