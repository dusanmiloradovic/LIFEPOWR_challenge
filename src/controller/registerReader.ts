import { toDoubleBuf, toFloatBuf } from "../conversions";
import ModbusRTU from "modbus-serial";
import { Register, RegisterDataType } from "../registers/types";

interface IRegisterReader {
  getRegisterSize(): number;

  getInternalNumericValue(data: number[]): number;
}

abstract class RegisterReader implements IRegisterReader {
  constructor(
    private readonly client: ModbusRTU,
    private readonly register: Register,
  ) {}

  abstract getInternalNumericValue(data: number[]): number;

  abstract getRegisterSize(): number;

  async getNumericValue(): Promise<number> {
    const regSize = this.getRegisterSize();
    const data = await this.client.readHoldingRegisters(
      this.register.address,
      regSize,
    );
    return this.getInternalNumericValue(data.data);
  }
}

class Float32RegisterReader extends RegisterReader implements IRegisterReader {
  getInternalNumericValue(data: number[]): number {
    return toFloatBuf(data[0], data[1]);
  }

  getRegisterSize(): number {
    return 2;
  }
}

class DoubleRegisterReader extends RegisterReader implements IRegisterReader {
  getInternalNumericValue(data: number[]): number {
    return toDoubleBuf(data[0], data[1], data[2], data[3]);
  }

  getRegisterSize(): number {
    return 4;
  }
}

class Int16RegisterReader extends RegisterReader implements IRegisterReader {
  getInternalNumericValue(data: number[]): number {
    return data[0];
  }

  getRegisterSize(): number {
    return 1;
  }
}

class Uint64RegisterReader extends RegisterReader implements IRegisterReader {
  getInternalNumericValue(data: number[]): number {
    return data[0] + (data[1] << 16) + (data[2] << 32) + (data[3] << 48);
  }

  getRegisterSize(): number {
    return 4;
  }
}

class CharRegisterReader extends RegisterReader implements IRegisterReader {
  getInternalNumericValue(data: number[]): number {
    console.log(
      `Incorrectly trying to get data for ${data} with CharRegisterReader`,
    );
    return 0;
  }

  getRegisterSize(): number {
    return 0;
  }

  async getNumericValue(): Promise<number> {
    throw new Error("Register doesn't support char");
  }
}

export function getRegisterReader(
  client: ModbusRTU,
  register: Register,
): RegisterReader {
  switch (register.dataType) {
    case RegisterDataType.UInt16:
    case RegisterDataType.Int16:
      return new Int16RegisterReader(client, register);
    case RegisterDataType.Float32:
      return new Float32RegisterReader(client, register);
    case RegisterDataType.Double:
      return new DoubleRegisterReader(client, register);
    case RegisterDataType.Char:
      return new CharRegisterReader(client, register);
    case RegisterDataType.UInt64:
      return new Uint64RegisterReader(client, register);
  }
}
