// there is only one writable, float32 register, no need for factory classes
import ModbusRTU from "modbus-serial";
import { Register, RegisterName } from "../registers/types";
import { fromFloatBuf } from "../conversions";

class RegisterWriter {
  constructor(
    private readonly client: ModbusRTU,
    private readonly register: Register,
  ) {}

  async setNumericValue(num: number) {
    if (this.register.name !== RegisterName.ModbusSlaveMaxCurrent) {
      throw new Error("Register nor writeable");
    }
    const d = fromFloatBuf(num);
    await this.client.writeRegisters(this.register.address, d);
  }
}

export function getRegisterWriter(
  client: ModbusRTU,
  register: Register,
): RegisterWriter {
  return new RegisterWriter(client, register);
}
