
// Val is a boolean expression to check for.
// Message is the given message to send if this expression fails.
export default function assert(val: any, message: string): asserts val {
  if (!val) {
      throw new AssertionError(message);
  }
}

// Error type for assertions 
class AssertionError extends Error {
    constructor (message: string) {
        super(message);
    }
}
