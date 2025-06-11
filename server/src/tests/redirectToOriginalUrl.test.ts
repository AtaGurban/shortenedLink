import { Request, Response, NextFunction } from "express";
import { ShortenedLinkClick } from "../models/ShortenedLinkModels.ts";
import shortenedLinkControllers from "../controllers/ShortenedLinkControllers.ts";
import ApiError from "../error/ApiError.ts";
import shortenedLinkDao from "../dao/ShortenedLinkDao/ShortenedLinkDao.ts";
import { sleep } from "../utils/commonFunc.ts";

jest.mock("../dao/ShortenedLinkDao/ShortenedLinkDao.ts");
jest.mock("../models/ShortenedLinkModels.ts");

describe("redirectToOriginalUrl", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;
  let responseObject: Record<string, any>;

  beforeEach(() => {
    mockRequest = {
      params: { shortUrl: "abc123" },
      headers: { "x-forwarded-for": "192.168.1.1" },
      socket: { remoteAddress: "127.0.0.1" } as any,
    };

    responseObject = {};
    mockResponse = {
      redirect: jest.fn().mockImplementation((url) => {
        responseObject.redirectUrl = url;
        return mockResponse;
      }),
    };

    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it("should redirect to original URL when alias is valid", async () => {
    const mockLinkData = {
      success: true,
      data: { id: 1, originalUrl: "https://example.com" },
      message: "",
    };

    (
      shortenedLinkDao.getShortenedLinkForRedirect as jest.Mock
    ).mockResolvedValue(mockLinkData);
    (ShortenedLinkClick.create as jest.Mock).mockResolvedValue({});

    await shortenedLinkControllers.redirectToOriginalUrl(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(shortenedLinkDao.getShortenedLinkForRedirect).toHaveBeenCalledWith(
      "abc123"
    );
    await sleep(1000)
    expect(mockResponse.redirect).toHaveBeenCalledWith("https://example.com");
     await sleep(1000)
    expect(ShortenedLinkClick.create).toHaveBeenCalledWith({
      ip: "192.168.1.1",
      linkId: 1,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next with error when alias is invalid", async () => {
    const mockLinkData = {
      success: false,
      data: null,
      message: "Link not found",
    };

    (
      shortenedLinkDao.getShortenedLinkForRedirect as jest.Mock
    ).mockResolvedValue(mockLinkData);

    await shortenedLinkControllers.redirectToOriginalUrl(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(shortenedLinkDao.getShortenedLinkForRedirect).toHaveBeenCalledWith(
      "abc123"
    );
    expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
    expect(mockResponse.redirect).not.toHaveBeenCalled();
    expect(ShortenedLinkClick.create).not.toHaveBeenCalled();
  });

  it("should handle IP from socket when x-forwarded-for is not present", async () => {
    mockRequest.headers = {};
    const mockLinkData = {
      success: true,
      data: { id: 1, originalUrl: "https://example.com" },
      message: "",
    };

    (
      shortenedLinkDao.getShortenedLinkForRedirect as jest.Mock
    ).mockResolvedValue(mockLinkData);
    (ShortenedLinkClick.create as jest.Mock).mockResolvedValue({});

    await shortenedLinkControllers.redirectToOriginalUrl(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );
 await sleep(1000)
    expect(ShortenedLinkClick.create).toHaveBeenCalledWith({
      ip: "127.0.0.1",
      linkId: 1,
    });
  });

  it("should not fail redirect if click tracking fails", async () => {
    const mockLinkData = {
      success: true,
      data: { id: 1, originalUrl: "https://example.com" },
      message: "",
    };

    (
      shortenedLinkDao.getShortenedLinkForRedirect as jest.Mock
    ).mockResolvedValue(mockLinkData);
    (ShortenedLinkClick.create as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    await shortenedLinkControllers.redirectToOriginalUrl(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.redirect).toHaveBeenCalledWith("https://example.com");
    expect(mockNext).not.toHaveBeenCalled();
  });
});
