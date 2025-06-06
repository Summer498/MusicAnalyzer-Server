export interface SerializedGravity {
  destination: number;
  resolved: true | undefined;
}

export const createSerializedGravity = (
  destination: number,
  resolved: true | undefined,
): SerializedGravity => ({ destination, resolved });

export const cloneSerializedGravity = (e: SerializedGravity) =>
  createSerializedGravity(e.destination, e.resolved);
