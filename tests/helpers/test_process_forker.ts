import { IProcessForker } from "../../src/interfaces/iprocess_forker";
import { TestProcess } from "./test_process";

export class TestProcessForker implements IProcessForker {
  public fork(fileName: string) {
    return new TestProcess();
  }
}
