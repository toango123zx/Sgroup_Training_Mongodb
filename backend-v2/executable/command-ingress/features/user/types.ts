type UserFollowing = {
  id: string;
}

type UserFollower = {
  id: string;
}

type UserEntity = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  followings: UserFollowing[];
  followers: UserFollower[];
}

interface UserService {
  getOne(id: string): Promise<UserEntity>;
  addFollowingByUserId(userId: string, userFollowingId: string): Promise<void>;
  unfollowByUserId(userId: string, userFollowingId: string): Promise<void>;
}

export {
  UserFollowing,
  UserFollower,
  UserEntity,
  UserService,
};
