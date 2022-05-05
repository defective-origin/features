import { merge } from "lodash-es"

// TODO: add subscription on changing?


export type ID = number | string
export type DefaultFetchOptions = RequestInit | (() => RequestInit)
export type TPaginationOptions = {
  page: number | string
  count: number | string
}

/**
 * Request interface based on REST API architecture.
 * @example
 * const endpoint = new RestApiEndpoint('google.com')
 * 
 * // init endpoint with default fetch options for all requests
 * const endpoint = new RestApiEndpoint('google.com', { mode: 'cors', headers: { 'security-token': 'some-token' })
 * 
 * // init endpoint with getting postponed default fetch options for all requests
 * const endpoint = new RestApiEndpoint('google.com', () => ({ mode: 'cors', headers: { 'security-token': 'some-token' }))
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
 */
export class RestApiEndpoint {
  constructor(
    private url: string,
    private defaultFetchOptions: DefaultFetchOptions = {},
  ) {}

  /**
   * Build url from parts.
   * @example
   * this.buildUrl('google.com', 'users', '12345')
   * // 'google.com/users/12345'
   * 
   * @param params Parts of urls.
   * @returns Result url.
   */
  private buildUrl(...params: (string | number)[]): string {
    return params.filter((item) => item || item === 0).join('/')
  }

  private getDefaultFetchOptions(): RequestInit {
    return typeof this.defaultFetchOptions === 'function' ? this.defaultFetchOptions() : this.defaultFetchOptions
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
   * // get record via POST request
   * endpoint.get(user.id, { isSecure: true })
   * 
   * 
   * @param idOrOptionsOrInit Record id or Pagination options or Fetch options.
   * @param init Options for fetch request.
   * @returns Promise with response.
   */
  public get<TInitOptions = RequestInit & { isSecure?: boolean }>(
    idOrOptionsOrInit: TInitOptions | TPaginationOptions | ID = {} as TInitOptions,
    init = {} as TInitOptions,
  ): Promise<Response> {
    const isFirstArgumentObject = typeof idOrOptionsOrInit === 'object' && idOrOptionsOrInit !== null
    const isFirstArgumentID = typeof idOrOptionsOrInit === "string" || typeof idOrOptionsOrInit === "number"
    const isFirstArgumentPaginationOptions = isFirstArgumentObject && 'page' in idOrOptionsOrInit
    const isFirstArgumentFetchOptions = !isFirstArgumentID && !isFirstArgumentPaginationOptions
    const { isSecure, ...fetchOptions }: RequestInit & { isSecure?: boolean } = isFirstArgumentFetchOptions ? idOrOptionsOrInit : init
    const initOptions = merge({ method: isSecure ? 'POST' : 'GET' }, this.getDefaultFetchOptions(), fetchOptions)

    // get record by id
    if (isFirstArgumentID) {
      return fetch(this.buildUrl(this.url, idOrOptionsOrInit), initOptions)
    }

    // get records on specific page
    if (isFirstArgumentPaginationOptions) {
      const searchParams = new URLSearchParams({
        page: idOrOptionsOrInit.page.toString(),
        count: idOrOptionsOrInit.count.toString(),
      })

      return fetch(`${this.url}?${searchParams}`, initOptions)
    }

    // get all records
    return fetch(this.url, initOptions)
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
  public create(record: object, init: RequestInit = {}): Promise<Response> {
    const initOptions = merge(
      { method: 'PUT', body: JSON.stringify(record), headers: { 'Content-Type': 'application/json'  } },
      this.getDefaultFetchOptions(),
      init,
    )
  
    return fetch(this.url, initOptions)
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
  public update(id: ID, record: object, init: RequestInit = {}): Promise<Response> {
    const initOptions = merge(
      { method: 'PATCH', body: JSON.stringify(record), headers: { 'Content-Type': 'application/json'  } },
      this.getDefaultFetchOptions(),
      init,
    )
  
    return  fetch(this.buildUrl(this.url, id), initOptions)
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
  public delete(id: ID, init: RequestInit = {}): Promise<Response> {
    const initOptions = merge({ method: 'DELETE' }, this.getDefaultFetchOptions(), init)

    return fetch(this.buildUrl(this.url, id), initOptions)
  }
}
