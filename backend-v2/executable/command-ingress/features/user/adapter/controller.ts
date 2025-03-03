import { BaseController } from '../../../shared/base-controller';
import { HttpRequest } from '../../../types';
import { UserFollower, UserService } from '../types';
import { Response, NextFunction } from 'express';

export class UserController extends BaseController {
  service: UserService;

  constructor(service: UserService) {
    super();
    this.service = service;
  }

  async getOne(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const user = await this.service.getOne(id);
      res.status(200).json(user);
      return;
    });
  }

  async getFollowersByUserId(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const userId = req.getSubject();
      const user = await this.service.getOne(userId);
      const followingsResponst: UserFollower[] = user.followings;
      res.status(200).json(followingsResponst);
      return;
    });
  }

  async addFollowingByUserId(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const userId = req.getSubject();
      await this.service.addFollowingByUserId(userId, id);
      res.status(200).json({ message: 'Following added' });
      return;
    });
  }

  async removeFollowingByUserId(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const userId = req.getSubject();
      await this.service.unfollowByUserId(userId, id);
      res.status(200).json({ message: 'Following removed' });
      return;
    });
  }
}