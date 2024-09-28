export function toFloatBuf(b0: number, b1: number): number {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint16(0, b0);
  view.setUint16(2, b1);
  return view.getFloat32(0);
}

export function fromFloatBuf(num: number): [number, number] {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, num);
  return [view.getUint16(0), view.getUint16(2)];
}

export function toDoubleBuf(
  b0: number,
  b1: number,
  b2: number,
  b3: number,
): number {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint16(0, b0);
  view.setUint16(2, b1);
  view.setUint16(4, b2);
  view.setUint16(6, b3);
  return view.getFloat64(0);
}

export function fromDoubleBuf(num: number): [number, number, number, number] {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, num);
  return [
    view.getUint16(0),
    view.getUint16(2),
    view.getUint16(4),
    view.getUint16(6),
  ];
}
