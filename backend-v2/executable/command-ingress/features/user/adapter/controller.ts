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

  async addFollowingByUserId(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const userFollowingId = req.getSubject();
      await this.service.addFollowingByUserId(id, userFollowingId);
      res.status(200).json({ message: 'Following added' });
      return;
    });
  }

  async removeFollowingByUserId(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const userFollowingId = req.getSubject();
      await this.service.unfollowByUserId(id, userFollowingId);
      res.status(200).json({ message: 'Following removed' });
      return;
    });
  }
}