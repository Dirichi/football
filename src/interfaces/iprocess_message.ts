import { PROCESS_MESSAGE_TYPE } from "../constants";

export interface IProcessMessage {
  messageType: PROCESS_MESSAGE_TYPE;
  data: object;
}
