type EventHandler = (payload: any, eventName: string) => void
type Handler = { token: string; func: EventHandler; once: boolean }
type HandlerMap = Record<string, Handler[]>

export default class Emiteer {
  private handlers: HandlerMap
  private subUid: number

  constructor() {
    this.handlers = {}
    this.subUid = -1
  }

  private addListener(
    event: string,
    fn: EventHandler,
    token?: string,
    once: boolean = false
  ): string {
    if (!fn || typeof fn !== 'function') {
      throw new TypeError('Callback function must be provided')
    }

    if (!this.handlers[event]) this.handlers[event] = []

    const _token: string = token || (++this.subUid).toString()
    const handler: Handler = { token: _token, func: fn, once }

    this.handlers[event].push(handler)

    return _token
  }

  private dispatch(event: string, payload?: any): boolean {
    const handlers = this.handlers[event]
    if (!handlers) return false

    setTimeout(() => {
      const subscribers = this.handlers[event]
      let len = subscribers ? subscribers.length : 0

      while (len--) {
        subscribers[len].func(payload, event)

        if (subscribers[len].once) {
          this.off(event, subscribers[len].token)
        }
      }
    }, 0)

    return true
  }

  private removeListener(
    event: string,
    fnOrToken?: string | number | EventHandler
  ): string | boolean {
    if (typeof fnOrToken === 'undefined') {
      delete this.handlers[event]
      return true
    }

    const handlers = this.handlers[event]
    if (!handlers) return false

    const index =
      typeof fnOrToken === 'function'
        ? handlers.findIndex((handler) => handler.func === fnOrToken)
        : handlers.findIndex((handler) => handler.token === fnOrToken)

    if (index !== -1) {
      const removedHandler = handlers.splice(index, 1)[0]
      return typeof fnOrToken === 'function'
        ? removedHandler.token
        : fnOrToken?.toString() ?? ''
    }

    return false
  }

  // --- main functions
  ensure(event: string, payload: any): NodeJS.Timeout | boolean | void {
    if (!this.handlers[event] || !this.handlers[event].length) {
      return setTimeout(() => this.ensure(event, payload), 100)
    }

    this.emit(event, payload)
  }

  emit(event: string, payload?: any): boolean {
    return this.dispatch(event, payload)
  }

  off(
    event: string,
    fnOrToken?: string | number | EventHandler
  ): string | boolean {
    return this.removeListener(event, fnOrToken)
  }

  on(event: string, fn: EventHandler, token?: any): string {
    return this.addListener(event, fn, token, false)
  }

  once(event: string, fn: EventHandler, token?: any): string {
    return this.addListener(event, fn, token, true)
  }

  // --- utility functions

  destroyAllHandlers(): void {
    this.handlers = {}
  }

  destroyAllHandlersForEvent(event: string): void {
    delete this.handlers[event]
  }

  getSubscribers(): HandlerMap {
    return Object.keys(this.handlers).reduce((acc, event) => {
      acc[event] = this.handlers[event].map((handler) => ({ ...handler }))
      return acc
    }, {} as HandlerMap)
  }

  getSubscribersByName(event: string): Handler[] {
    return this.handlers[event]
      ? this.handlers[event].map((handler) => ({ ...handler }))
      : []
  }

  hasSubscriber(event: string, token?: string): boolean {
    return !!this.handlers[event]?.find(
      (handler) => !token || handler.token === token
    )
  }

  hasSubscribers(event?: string | null): boolean {
    if (event == null) {
      return Object.keys(this.handlers).length > 0
    }

    return this.handlers.hasOwnProperty(event)
  }
}
