import { ApplicationBackendService } from "./ApplicationBackendService";

export class TestApplicationBackendService extends ApplicationBackendService {
  constructor() {
    super("http://localhost:3033/api");
  }
}
