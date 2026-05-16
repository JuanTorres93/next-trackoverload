import { AuthService } from "../../../domain/services/AuthService.port";
import { JwtAuthService } from "../../../infra/services/AuthService/JwtAuthService/JwtAuthService";
import { MemoryAuthService } from "../../../infra/services/AuthService/MemoryAuthService/MemoryAuthService";
import { injectFor_ProductionDevelopment_Test } from "../../common/injectFor_ProductionDevelopment_Test";

const secret = process.env.JWT_SECRET;

const AppAuthService: AuthService = await injectFor_ProductionDevelopment_Test<
  AuthService,
  [string]
>(JwtAuthService, MemoryAuthService, {
  beforeProdDev: async () => {
    if (!secret) {
      throw new Error(
        "AppAuthService: JWT_SECRET environment variable is not set",
      );
    }
  },
  prodDevConstructorArgs: [secret!],
});

export { AppAuthService };
