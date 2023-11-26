const SessionId = require("../../src/utils/SessionId");
const SessionHelper = require("../../src/helpers/SessionHelper");

// jest.mock("../../src/helpers/SessionHelper", () => ({
//   getExistingUserSessionId: jest.fn(),
// }));


jest.useFakeTimers();

describe("SessionId TestCases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return existing session ID if found", async () => {
    const existingUserSessionId = "12345";
    jest
      .spyOn(SessionHelper, "getExistingUserSessionId")
      .mockReturnValueOnce(existingUserSessionId);

    const sessionID = await SessionId.cookieToken("test@example.com", {
      status: jest.fn(),
      cookie: jest.fn(),
    });

    expect(sessionID).toBe(existingUserSessionId);
    expect(SessionHelper.getExistingUserSessionId).toHaveBeenCalledTimes(1);
    expect(SessionHelper.getExistingUserSessionId).toHaveBeenCalledWith(
      "test@example.com"
    );
  });
});
