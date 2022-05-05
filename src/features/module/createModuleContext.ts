import { createContext, IContextGeneratorOptions } from "./createContext"
import { Module } from "./Module"

export type TModuleContextOptions<T> = Omit<IContextGeneratorOptions<T>, "selector">

/**
 * Create module context.
 * @example
 * const [ModuleContext, useModule] = createModuleContext({
 *  defaultValue: null,
 *  displayName: 'DEBUG MODULE NAME', // optional
 * })
 * 
 * const [api, options] = useModule()
 * 
 * 
 * @param options Config settings.
 * @returns [Context, useModule].
 */
export function createModuleContext(options: TModuleContextOptions<Module>) {
  return createContext<Module>({
    ...options,
    selector: (module: Module) => [module.rootNode, module.options],
  })
}