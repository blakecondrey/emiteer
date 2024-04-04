# Emiteer

Emiteer is a lightweight and flexible event emitter library for JavaScript and TypeScript. It allows you to manage events and event listeners in your applications with ease.

## Installation

You can install Emiteer via npm:

```bash
npm install emiteer
```

## Usage

First, import Emiteer in your JavaScript or TypeScript file:

```typescript
import Emiteer from 'emiteer'
```

Then, create an instance of Emiteer:

```typescript
const emitter = new Emiteer()
```

### Adding Event Listeners

You can add event listeners using the `on` method:

```typescript
const subscriptionToken = emitter.on('eventName', (payload, eventName) => {
  console.log(`Received event: ${eventName}, Payload:`, payload)
})
```

You can also subscribe to an event that will be triggered only once using the `once` method:

```typescript
const onceToken = emitter.once('eventNameOnce', (payload, eventName) => {
  console.log(`Received event once: ${eventName}, Payload:`, payload)
})
```

### Emitting Events

You can emit events using the `emit` method:

```typescript
emitter.emit('eventName', { message: 'Hello, Emiteer!' })
```

### Removing Event Listeners

To remove event listeners, you can use the `off` method:

```typescript
emitter.off('eventName', subscriptionToken)
```

### Utility Methods

- `destroyAllHandlers`: Clears all event handlers.
- `destroyAllHandlersForEvent(event: string)`: Clears event handlers for a specific event.
- `getSubscribers`: Retrieves a copy of all subscribers mapped by event name.
- `getSubscribersByName(event: string)`: Retrieves a copy of subscribers for a specific event.
- `hasSubscriber(event: string, token?: string)`: Checks if a subscriber exists for an event.
- `hasSubscribers(event?: string | null)`: Checks if any subscribers exist.

## License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
