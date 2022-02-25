import { render, fireEvent, RenderResult, waitForElementToBeRemoved, waitFor, Matcher } from '@testing-library/react'


// FIXME: В testing-library/react события не нужно оборачивать в act(он содержится в waitFor). Следовательно также не нужен вэйтер https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/#using-act-and-wrapperupdate

// TESTING LIBRARY IMPLEMENTATION
export default class ComponentTestUtil
{
  private render: RenderResult

  // LIFECYCLE
  private constructor(...args: Parameters<typeof render>) {
    this.render = render(...args)
  }

  public static render(...args: Parameters<typeof render>) {
    return new ComponentTestUtil(...args)
  }

  public rerender(...args: Parameters<typeof this.render.rerender>) {
    this.render.rerender(...args)

    return this
  }

  public unmount() {
    this.render.unmount()

    return this
  }


  // EVENTS
  public setValue(id: Matcher, value: string | number) {
    fireEvent.change(this.get(id), { target: { value } })

    return this
  }
  
  private _click<T extends HTMLElement>(elem: T) {
    fireEvent.click(elem)

    return this
  }

  public click(id: Matcher) {
    return this._click(this.get(id))
  }

  public clickOnText(id: Matcher) {
    return this._click(this.getByText(id))
  }

  public focus(id: Matcher) {
    fireEvent.focus(this.get(id))

    return this
  }

  public blur(id: Matcher) {
    fireEvent.blur(this.get(id))

    return this
  }


  // SELECTORS
  public get<T extends HTMLElement>(id: Matcher) {
    return this.render.getByTestId(id) as T
  }

  public getByText<T extends HTMLElement>(id: Matcher) {
    return this.render.getByText(id) as T
  }

  public getAll(id: Matcher) {
    return this.render.getAllByTestId(id)
  }

  // findBy = getBy + waitFor
  // public find<T extends HTMLElement = HTMLElement>(...args: Parameters<typeof this.render.findByTestId>) {
  //   return this.render.findByTestId(...args) as Promise<T>
  // }

  // public findByText<T extends HTMLElement>(...args: Parameters<typeof this.render.findByText>) {
  //   return this.render.findByText(...args) as Promise<T>
  // }

  // public findAll(...args: Parameters<typeof this.render.findAllByTestId>) {
  //   return this.render.findAllByTestId(...args)
  // }

  // public findAllByText(...args: Parameters<typeof this.render.findAllByText>) {
  //   return this.render.findAllByText(...args)
  // }


  // CHECKS
  public snapshot(base = false) {
    return base ? this.render.baseElement : this.render.asFragment()
  }

  public isEmpty() {
    return this.render.container.firstChild === null
  }

  public debug(...args: Parameters<typeof this.render.debug>) {
    this.render.debug(...args)
  
    return this
  }


  // EXTENSIONS
  // private act = act
  // public wait() {
  //   return this.act(() => new Promise(setImmediate))
  // }

  public waitFor = waitFor
  public waitForElementToBeRemoved = waitForElementToBeRemoved
}
