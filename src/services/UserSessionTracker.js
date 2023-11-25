const createUserActivityTracker = () => {
  
  const lastUserActivityTimes = new Map();

    const getLastUserActivityTime = (email) => {
      return lastUserActivityTimes.get(email);
    };


    const updateLastUserActivityTime = (email) => {
      return lastUserActivityTimes.set(email, Date.now());
    };


    return {
      getLastUserActivityTime,
      updateLastUserActivityTime,
    };
}


module.exports = createUserActivityTracker()