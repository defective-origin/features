export type RequestValidationConf<TSchema = any> = {
  input?: {
    schema: TSchema
    selector: (...param: any) => any
  }
  output?: {
    schema: TSchema
    selector: (response: any) => any
  }
  meta?: {
    schema: TSchema
    selector: (response: any) => any
  }
}

export type Validator = (data: any, schema: any) => never
export type EndpointHandler = (...params: any) => Promise<any>


/**
 * Create wrapped function which validate function arguments.
 * @example
 * const getUsers(id) {
 *  return fetch(`http://example.com/users/{id}`)
 *          .then(response => response.json())
 * }
 * const user_id = 15
 * 
 * const inputSchema = yup.number().positive().required()
 * const outputSchema = yup.object({
 *   name: string().default(''),
 * });
 * const metaSchema = yup.object({
 *   page: yup.number().positive().required()
 *   count: yup.number().positive().required()
 * });
 * const validationConfig = {
 *  input: { schema: inputSchema, selector: (id) => id  }
 *  output: { schema: outputSchema, selector: (response) => response.data  }
 *  meta: { schema: metaSchema, selector: (response) => response.meta  }
 * }
 * 
 * const getUserWithValidation = createValidatedApiEndpoint(
 *  getUsers,
 *  (data, schema) => schema.validate(data),
 *  validationConfig,
 * )
 * 
 * getUserWithValidation(user_id) // return response
 * 
 * getUserWithValidation('WRONG ID') // throw validation error
 * 
 * @param handler Function which should be wrapped and checked.
 * @param validator Function which call validation function on schema.
 * @param conf Configuration for validating.
 * @returns Response of wrapped function.
 */
export function createValidatedApiEndpoint(
  handler: EndpointHandler,
  validator: Validator,
  conf: RequestValidationConf = {},
) {
  return function validatedApiEndpoint(...params: Parameters<typeof handler>) {
    if (conf.input) {
      validator(conf.input.selector(...params), conf.input.schema)
    }

    return handler(...params)
      .then((response) => {
        if (conf.output) {
          validator(conf.output.selector(response), conf.output.schema)
        }
      })
      .then((response) => {
        if (conf.meta) {
          validator(conf.meta.selector(response), conf.meta.schema)
        }
      })
  }
}