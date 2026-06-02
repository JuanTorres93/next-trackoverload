import { UserDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import { PermissionError } from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { toUserDTO } from "../../../dtos/UserDTO";

export type GetUserByIdUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
};

export class GetUserByIdUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: GetUserByIdUsecaseRequest): Promise<UserDTO | null> {
    if (request.actorUserId !== request.targetUserId) {
      logNoTest(
        `GetUserByIdUsecase: Access denied for user ${request.actorUserId} to get user ${request.targetUserId}`,
      );

      throw new PermissionError("No puedes ver los datos de otro usuario.");
    }

    const user = await this.usersRepo.getUserById(request.targetUserId);
    return user ? toUserDTO(user) : null;
  }
}
