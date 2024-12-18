import * as jwt from '../../src/utils/jwt';
import { verifyUser } from '../../src/services/authService';

afterEach(jest.clearAllMocks);

describe('Auth Service', () => {
  describe('Verify User', () => {
    it.skip('Should return null if the token is invalid', () => {
      const invalidToken = 'InvalidToken';

      const mock = jest.spyOn(jwt, 'validateToken');
      mock.mockImplementation(() => {
        return null;
      });

      const user = verifyUser(invalidToken);

      expect(mock).toHaveBeenCalled();
      expect(user).toBe(null);
    });
    it.skip('Should return the decoded token if token is valid', () => {
      const validToken = 'validToken';
      const decodedToken = 'decodedToken';

      const mock = jest.spyOn(jwt, 'validateToken');
      mock.mockImplementation(() => {
        return decodedToken;
      });

      const user = verifyUser(validToken);

      expect(mock).toHaveBeenCalled();
      expect(user).toBe(decodedToken);
    });
  });
});
