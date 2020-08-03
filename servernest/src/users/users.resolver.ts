import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { UserAccountDto } from '../userAccounts/dto/userAccount.dto';
import { UserAccount } from '../userAccounts/userAccount.entity';
import { UserAccountsService } from '../userAccounts/userAccounts.service';
import { UserExternalLoginDto } from '../userExternalLogins/dto/userExternalLogin.dto';
import { UserExternalLogin } from '../userExternalLogins/userExternalLogin.entity';
import { UserExternalLoginsService } from '../userExternalLogins/userExternalLogins.service';
import { ChallengesService } from '../challenges/challenges.service';
import { SolvedChallengeDto } from '../solvedChallenges/dto/solvedChallenge.dto';
import { SolvedChallenge } from '../solvedChallenges/solvedChallenge.entity';
import { Challenge } from '../challenges/challenge.entity';
import { ChallengeDto } from '../challenges/dto/challenge.dto';
import { SubscriptionDto } from '../subscriptions/dto/subscription.dto';
import { Subscription } from '../subscriptions/subscription.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Resolver(() => UserDto)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly userAccountsService: UserAccountsService,
    private readonly userExternalLoginsService: UserExternalLoginsService,
    private readonly subscriptionsService: SubscriptionsService, // private readonly challengesService: ChallengesService,
  ) {}

  @Query(() => [UserDto])
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => [UserDto])
  async getUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  @ResolveField('solvedChallenges', () => [SolvedChallengeDto])
  async getSolvedChallenges(@Parent() user: User): Promise<SolvedChallenge[]> {
    return this.usersService.findSolvedChallengesByUserId(user.id);
  }

  @ResolveField('likedChallenges', () => [ChallengeDto])
  async getLikedChallenges(@Parent() user: User): Promise<Challenge[]> {
    return this.usersService.findLikedChallengesByUserId(user.id);
  }

  @ResolveField('userAccount', () => UserAccountDto, { nullable: true })
  async getUserAccount(@Parent() user: User): Promise<UserAccount> {
    return this.userAccountsService.findById(user.userAccountId);
  }

  @ResolveField('userExternalLogins', () => [UserExternalLoginDto])
  getUserExternalLogins(@Parent() user: User): Promise<UserExternalLogin[]> {
    return this.userExternalLoginsService.findByUserId(user.id);
  }

  @ResolveField('subscriptionPlans', () => [SubscriptionDto])
  getUserSubscriptionPlans(@Parent() user: User): Promise<Subscription[]> {
    return this.subscriptionsService.findByUserId(user.id);
  }
}
