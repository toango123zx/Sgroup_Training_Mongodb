import express from 'express';
import { UserController } from './controller';
import requireAuthorizedUser from '../../../middlewares/auth';

const setupUserRoute = (controller: UserController) => {
    const router = express.Router();

    router.get('/followers', requireAuthorizedUser, controller.getFollowersByUserId.bind(controller));
    router.get('/followings', requireAuthorizedUser, controller.getFollowingsByUserId.bind(controller));
    router.get('/:id', controller.getOne.bind(controller));
    router.post('/:id/follow', requireAuthorizedUser, controller.addFollowingByUserId.bind(controller));
    router.delete('/:id/unfollow', requireAuthorizedUser, controller.removeFollowingByUserId.bind(controller));

    return router;
}

export default setupUserRoute;
