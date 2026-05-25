import { logNoTest } from "@/utils/logNoTest";

import {
  NotFoundError,
  PermissionError,
} from "../../../../domain/common/errors";
import { UserUpdateProps } from "../../../../domain/entities/user/User";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { UserDTO, toUserDTO } from "../../../dtos/UserDTO";

export type UpdateUserUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
  patch?: UserUpdateProps;
};

export class UpdateUserUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: UpdateUserUsecaseRequest): Promise<UserDTO> {
    if (request.actorUserId !== request.targetUserId) {
      logNoTest(`UpdateUserUsecase: Access denied to update this user`);

      throw new PermissionError(
        "No puedes modificar los datos de otro usuario.",
      );
    }

    const existingUser = await this.usersRepo.getUserById(request.targetUserId);

    if (!existingUser) {
      logNoTest(
        `UpdateUserUsecase: User with id ${request.targetUserId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    const patch: UserUpdateProps = request.patch || {};
    existingUser.update(patch);

    await this.usersRepo.saveUser(existingUser);

    return toUserDTO(existingUser);
  }
}
