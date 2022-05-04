import { useState, useEffect } from "react"

export enum RequestStatus {
  loading = 'loading',
  error = 'error',
  success = 'success',
}

export interface UseRequestResult<TResponse, TError extends Error = Error> {
  loading: boolean
  response?: TResponse
  error?: TError
  status?: RequestStatus
}

/**
 * Handle request and return status of request.
 * @example
 * const getUsers(id) {
 *  return fetch(`http://example.com/users/{id}`)
 * }
 * const user_id = 'SOME_ID'
 * 
 * const { loading, response, error, status } = useRequest(
 *  getUsers,
 *  user_id,
 * )
 * 
 * 
 * @param request Function which make a call to backend.
 * @param params Parameters of request function.
 * @returns Response with statuses.
 */
export function useRequest<TRequestFunc extends (...params: any) => Promise<any>>(request: TRequestFunc, ...params: Parameters<TRequestFunc>): UseRequestResult<ReturnType<TRequestFunc>> {
  const [loading, setLoading] = useState<boolean>(false)
  const [response, setResponse] = useState()
  const [error, setError] = useState<undefined | Error>()
  const [status, setStatus] = useState<undefined | RequestStatus>()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setStatus(RequestStatus.loading)
      setError(undefined)
      setResponse(undefined)

      try {
        let response = await request(...params)
        setResponse(response)
        setStatus(RequestStatus.success)
      } catch (error) {
        setError(error as Error)
        setStatus(RequestStatus.error)
      } finally {
        setLoading(false)
      }
    };
    loadData()
  }, [params, request])

  return { loading, response, error, status }
}
