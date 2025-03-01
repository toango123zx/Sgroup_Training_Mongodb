import { UserEntity, UserService } from '../types';
import UserModel from '../../../../../internal/model/user';
import user from '../../../../../internal/model/user';
import mongoose from 'mongoose';

export class UserServiceImpl implements UserService {
  async getOne(id: string): Promise<UserEntity> {
    const user = await UserModel.findById(id).populate('followings');

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: String(user._id),
      name: String(user.name),
      avatar: String(user.avatar),
      email: String(user.email),
      followings: user.followings.map((following: any) => {
        return {
          id: String(following.id),
          name: String(following.name),
        }
      }),
      followers: user.followers.map((follower: any) => {
        return {
          id: String(follower.id),
          name: String(follower.name),
        }
      }),
    };
  }

  async addFollowingByUserId(userId: string, userFollowingId: string): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await UserModel.findById(userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      const userFollowing = await UserModel.findById(userFollowingId).session(session);
      if (!userFollowing) {
        throw new Error('User Following not found');
      }

      await UserModel.updateOne(
        { _id: userFollowingId },
        { $addToSet: { followers: { _id: user._id } } },
        { session }
      );

      await UserModel.updateOne(
        { _id: userId },
        { $addToSet: { followings: { _id: userFollowing._id } } },
        { session }
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async unfollowByUserId(userId: string, userFollowingId: string): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await UserModel.findById(userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      const userFollowing = await UserModel.findById(userFollowingId).session(session);
      if (!userFollowing) {
        throw new Error('User Following not found');
      }

      await UserModel.updateOne(
        { _id: userId },
        { $pull: { followings: userFollowing._id } },
        { session }
      );

      await UserModel.updateOne(
        { _id: userFollowingId },
        { $pull: { followers: user._id } },
        { session }
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}