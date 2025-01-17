import buildMakeTempUserModel from './mongoose/tempUser/buildMakeTempUserModel';
import TempUser from './mongoose/tempUser/tempUserModel';
import buildMakeUserModel from './mongoose/user/buildMakeUserModel';
import User from './mongoose/user/userModel';

const makeUserModel = buildMakeUserModel(User);
const makeTempUserModel = buildMakeTempUserModel(TempUser);

export { makeUserModel, makeTempUserModel };
