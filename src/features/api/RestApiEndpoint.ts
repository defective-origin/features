import { merge } from "lodash-es"

// const endpoint = RestApiEndpoint(url, {
//   get: options / handler()
//   create: options / handler()
//   update: options / handler()
//   delete: options / handler()
// })
// endpoint.get() page/slice
// endpoint.get(id/[id,id,id]) page/slice
// endpoint.create(newObject/[newObject,newObject,newObject])
// endpoint.update(id, newObject/[newObject,newObject,newObject])
// endpoint.delete(id/[id,id,id])


//TODO: add documentation

export interface IPaginationOptions {
  page: number | string
  count: number | string
}
export type ID = number | string

export class RestApiEndpoint {
  constructor(
    private url: string,
    private defaultFetchOptions: RequestInit = {},
  ) {}

  
  private buildUrl(...params: (string | number)[]) {
    return params.filter((item) => item || item === 0).join('/')
  }

  public get(idOrOptions?: IPaginationOptions | ID, isSecure?: boolean, init?: RequestInit) {
    const initOptions = merge({ method: isSecure ? 'POST' : 'GET' }, this.defaultFetchOptions, init)

    if (idOrOptions === void 0) {
      return fetch(this.url, initOptions)
    }
  
    if (typeof idOrOptions === 'object' && idOrOptions !== null) {
      const searchParams = new URLSearchParams({
        page: idOrOptions.page.toString(),
        count: idOrOptions.count.toString(),
      })

      return fetch(`${this.url}?${searchParams}`, initOptions)
    }

    return fetch(this.buildUrl(this.url, idOrOptions), initOptions)
  }

  public create(newObject: object, init?: RequestInit) {
    const initOptions = merge(
      { method: 'PUT', body: JSON.stringify(newObject), headers: { 'Content-Type': 'application/json'  } },
      this.defaultFetchOptions,
      init,
    )
  
    return fetch(this.url, initOptions)
  }

  public update(id: ID, newObject: object, init?: RequestInit) {
    const initOptions = merge(
      { method: 'PATCH', body: JSON.stringify(newObject), headers: { 'Content-Type': 'application/json'  } },
      this.defaultFetchOptions,
      init,
    )
  
    return  fetch(this.buildUrl(this.url, id), initOptions)
  }

  public delete(id: ID, init?: RequestInit) {
    const initOptions = merge({ method: 'DELETE' }, this.defaultFetchOptions, init)

    return fetch(this.buildUrl(this.url, id), initOptions)
  }
}
