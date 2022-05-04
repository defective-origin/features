export type TNodeFunc = (...params: any) => Promise<any>
export type TTreeNode = { [key: string]: TNode }
export type TNode = TTreeNode | TNodeFunc | Module

// TODO: add registers to root node

/**
 * Service module.
 * @example
 * const module = new Module({ a: 1, b: 2 })
 * 
 * module.opt(() => ({ b: 3, c: 4 }))
 * module.opt(() => ({ d: 5, e: 6 }))
 * 
 * module.conf((opt, module) => {
 *  // set up anything
 * 
 *  module.opt(() => ({ f: 7, j: 8 }))
 * })
 * 
 * // register node with nested object api endpoint
 * module.register('lodash', {
 *  a: (options) => ({})
 *  b: (options) => ({})
 *  submodule: {
 *    a: (options) => ({})
 *    b: (options) => ({})
 *  }
 * })
 * 
 * // register node by composite key
 * module.register('lodash', {
 *  a: (options) => ({})
 *  b: (options) => ({})
 * })
 * module.register('lodash.submodule', {
 *  a: (options) => ({})
 *  b: (options) => ({})
 * })
 * 
 * // register node as submodule
 * const submodule = new Module({ a: 1, b: 2 })
 * submodule.register('a', (options) => ({}))
 * submodule.register('b', (options) => ({}))
 * 
 * module.register('lodash.submodule', submodule)
 * 
 * 
 * // register node without adding options into handlers
 * module.register('lodash', {
 *  a: (options) => ({})
 *  b: (options) => ({})
 * }, false)
 * 
 * 
 * // register nodes
 * module.registers({
 *  a: (options) => ({})
 *  b: (options) => ({})
 * })
 * 
 * // register nodes without adding options into handlers
 * module.registers({
 *  a: (options) => ({})
 *  b: (options) => ({})
 * }, false)
 * 
 * const [Context, useContext] = createModuleContext({
 *  defaultValue: null,
 *  displayName: 'DEBUG NAME', // optional
 * })
 * 
 * const [service, options] = useContext()
 * 
 * service.lodash.a()
 * service.lodash.submodule.b()
 * 
 */
export class Module<TreeNode = TTreeNode, Options extends object = {}>
{
  private _rootNode = {} as TreeNode

  public constructor(
    private _options = {} as Options,
  ) {}

  public get rootNode(): TreeNode {
    return this._rootNode
  }

  public get options(): Options {
    return this._options
  }

  /**
   * Update shared options.
   * @example
   * api.opt((options = {}) => {
   *  return { newField, ...options }
   * })
   * 
   * @param callback Function which returns new options.
   * @returns This.
   */
  public opt(callback: (options?: Options) => any): this {
    this._options = callback(this._options)

    return this
  }

  /**
   * Set up module.
   * @example
   * api.conf((options, module) => {
   *  options.client.use(...)
   *  options.client.use(...)
   *  options.client.use(...)
   * 
   *  module.opt((oldOptions) => ({ ...oldOptions, newField: 'SOME VALUE' }))
   * })
   * 
   * @param callback Function which set up client.
   * @returns This.
   */
  public conf(callback: (options?: Options, module?: Module<TreeNode, Options>) => void): this {
    callback(this._options, this)

    return this
  }

  /**
   * Wrap all functions in object recursively.
   * 
   * @param node Node handler or sub node.
   * @returns Updated node.
   */
  private _wrapHandlers(node: Record<string, any>) {
    if (typeof node === 'function') {
      const getLastOptions = () => this._options
      return function withOptions(...params: any[]) {
        return node(...params, getLastOptions())
      }
    }

    for (const [name, sub] of Object.entries(node)) {
      node[name] = this._wrapHandlers(sub)
    }

    return node
  }

  /**
   * Register node.
   * @example
   * // register node with nested object api endpoint
   * module.register('lodash', {
   *  a: (options) => ({})
   *  b: (options) => ({})
   *  submodule: {
   *    a: (options) => ({})
   *    b: (options) => ({})
   *  }
   * })
   * 
   * // register node by composite key
   * module.register('lodash', {
   *  a: (options) => ({})
   *  b: (options) => ({})
   * })
   * module.register('lodash.submodule', {
   *  a: (options) => ({})
   *  b: (options) => ({})
   * })
   * 
   * // register node as submodule
   * const submodule = new Module({ a: 1, b: 2 })
   * submodule.register('a', (options) => ({}))
   * submodule.register('b', (options) => ({}))
   * 
   * module.register('lodash.submodule', submodule)
   * 
   * // register node without adding options into handlers
   * module.register('lodash', {
   *  a: (options) => ({})
   *  b: (options) => ({})
   * }, false)
   * 
   * 
   * @param name Node name.
   * @param node Node handler or sub node.
   * @param wrapHandlers Should the options be passed into the each functions.
   * @returns This.
   */
  public register(name: string, node: TNode, wrapHandlers = true): this {
    const keys = name.split('.')
    const lastKey = keys.pop()
    const changingNode = keys.reduce((currentNode, key) => currentNode[key], this._rootNode as Record<string, any>)

    if (node instanceof Module && lastKey) {
      changingNode[lastKey] = node._rootNode
    } else if (lastKey) {
      changingNode[lastKey] = wrapHandlers ? this._wrapHandlers(node) : node
    }

    return this
  }

    /**
   * Register several nodes into root node.
   * @example
   * // register nodes
   * module.registers({
   *  a: (options) => ({})
   *  b: (options) => ({})
   * })
   * 
   * // register nodes without adding options into handlers
   * module.registers({
   *  a: (options) => ({})
   *  b: (options) => ({})
   * }, false)
   * 
   * 
   * @param node Tree node.
   * @param wrapHandlers Should the options be passed into the each functions.
   * @returns This.
   */
    public registers(node: TTreeNode, wrapHandlers = true): this {
      Object.entries(node).forEach(([name, node]) => this.register(name, node, wrapHandlers))
  
      return this
    }
}
