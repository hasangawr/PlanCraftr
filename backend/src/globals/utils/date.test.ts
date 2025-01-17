import { minutesElapsedTillNowFrom } from './date';

//test
describe('Dates', () => {
  describe('Get minutes from a given time till now', () => {
    it('Should return 0 if current time is passed', () => {
      const minutes = minutesElapsedTillNowFrom(new Date());
      expect(minutes).toBe(0);
    });

    it('Should return 1 if one minute has passed', () => {
      const minutes = minutesElapsedTillNowFrom(
        new Date(Date.now() - 60 * 1000),
      );
      expect(minutes).toBe(1);
    });

    it('Should return 100 if hundred minutes has passed', () => {
      const minutes = minutesElapsedTillNowFrom(
        new Date(Date.now() - 60 * 1000 * 100),
      );
      expect(minutes).toBe(100);
    });
  });
});
