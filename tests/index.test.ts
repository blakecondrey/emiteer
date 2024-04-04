import Emiteer from '../src/index'

const noop = () => {}

describe('Events', () => {
  let emiteer: Emiteer

  beforeEach(() => {
    emiteer = new Emiteer()
  })

  afterEach(() => {
    emiteer.destroyAllHandlers()
  })

  it('Should create a new instance of Events', () => {
    expect(emiteer).not.toBeUndefined()

    expect(emiteer).toBeInstanceOf(Emiteer)

    expect(emiteer instanceof Emiteer).toBeTruthy()
  })

  it('Should add a new event listener', () => {
    expect(emiteer.on('test', noop)).toBe('0')
  })

  it('Should subscribe once to an event', async () => {
    const eventHandled = new Promise<void>((resolve) => {
      emiteer.once('test-single-event', () => {
        expect(emiteer.hasSubscriber('test-single-event')).toBe(true)

        resolve()
      })
    })

    emiteer.emit('test-single-event')

    await eventHandled

    expect(emiteer.hasSubscriber('test-single-event')).toBe(false)
  })

  it('Should throw an exception if the callback is not a function', () => {
    const invalidCb: any = 'not a function'

    try {
      emiteer.on('test', invalidCb)
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    }
  })

  it('Should emit an event and pass the payload', () => {
    emiteer.on('test', (payload) => {
      expect(payload).toBe('test-payload')
    })

    emiteer.emit('test', 'test-payload')
  })

  it('Should return false if event has no subscribers/does not exist', () => {
    emiteer.on('event', noop)

    expect(emiteer.emit('no-subscribers')).toBe(false)
  })

  it('Should stop listening to an event', () => {
    emiteer.on('event', noop)

    const off = emiteer.off('event')

    expect(off).toBe(true)

    expect(emiteer.hasSubscriber('event')).toBe(false)
  })

  it('Should destroy all event listeners', () => {
    emiteer.on('event', noop)

    emiteer.on('another-event', noop)

    emiteer.on('yet-another-event', noop)

    emiteer.destroyAllHandlers()

    expect(emiteer.hasSubscribers()).toBe(false)
  })

  it('Should destroy all event listeners for a specific event', () => {
    emiteer.on('event', noop)

    emiteer.on('event', () => {
      console.log('Another event listener: event')
    })

    emiteer.on('another-event', noop)

    emiteer.on('yet-another-event', noop)

    emiteer.destroyAllHandlersForEvent('event')

    expect(emiteer.hasSubscribers('event')).toBe(false)

    expect(emiteer.hasSubscribers('another-event')).toBe(true)

    expect(emiteer.hasSubscribers('yet-another-event')).toBe(true)
  })

  it('Should return a deep copy of all subscribers', () => {
    emiteer.on('test1', noop)
    emiteer.on('test2', noop)

    const subscribers = emiteer.getSubscribers()
    expect(subscribers).toEqual({
      test1: [{ token: '0', func: noop, once: false }],
      test2: [{ token: '1', func: noop, once: false }],
    })
  })

  it('Should return a copy of subscribers by event name', () => {
    const fn1 = () => {}
    const fn2 = () => {}
    emiteer.on('test1', fn1)
    emiteer.on('test1', fn2)

    const subscribers = emiteer.getSubscribersByName('test1')
    expect(subscribers).toEqual([
      { token: '0', func: fn1, once: false },
      { token: '1', func: fn2, once: false },
    ])
  })

  it('Should return an empty array for non-existent event', () => {
    const subscribers = emiteer.getSubscribersByName('non-existent')
    expect(subscribers).toEqual([])
  })
})
