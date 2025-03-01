import express from 'express';
import { UserController } from './controller';
import requireAuthorizedUser from '../../../middlewares/auth';

const setupUserRoute = (controller: UserController) => {
    const router = express.Router();

    router.get('/:id', controller.getOne.bind(controller));
    router.post('/:id/follow', requireAuthorizedUser, controller.addFollowingByUserId.bind(controller));

    return router;
}

export default setupUserRoute;
