const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.onmessage = async (event) => {};

export default {} as typeof Worker & (new () => Worker);
