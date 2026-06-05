import { NotFoundApplicationError } from '@/application-layer/common/applicationErrors';
import { UserMatchesDTO, toUserMatchesDTO } from '@/application-layer/dtos/UserMatchesDTO';
import { UserMatchesRepo } from '@/domain/repos/UserMatchesRepo.port';

import { TransactionContext } from '../../services/TransactionContext.port';

export type MatchUsersUsecaseRequest = {
  oneUserId: string;
  anotherUserId: string;
};

export class MatchUsersUsecase {
  constructor(
    private userMatchesRepo: UserMatchesRepo,
    private transactionContext: TransactionContext,
  ) {}

  async execute(request: MatchUsersUsecaseRequest): Promise<ObjectWithUserMatches> {
    const [oneUserMatches, anotherUserMatches] = await Promise.all([
      this.userMatchesRepo.getByUserId(request.oneUserId),

      this.userMatchesRepo.getByUserId(request.anotherUserId),
    ]);

    if (!oneUserMatches || !anotherUserMatches)
      throw new NotFoundApplicationError(
        `UserMatches for userId ${oneUserMatches} and/or ${anotherUserMatches} not found`,
      );

    oneUserMatches.match(request.anotherUserId);
    anotherUserMatches.match(request.oneUserId);

    const returnObject: ObjectWithUserMatches = {
      [oneUserMatches.userId]: toUserMatchesDTO(oneUserMatches),
      [anotherUserMatches.userId]: toUserMatchesDTO(anotherUserMatches),
    };

    await this.transactionContext.run(async () => {
      await Promise.all([
        this.userMatchesRepo.save(oneUserMatches),

        this.userMatchesRepo.save(anotherUserMatches),
      ]);
    });

    return returnObject;
  }
}

export type ObjectWithUserMatches = Record<string, UserMatchesDTO>;
