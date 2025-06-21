import { NextResponse } from "next/server";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export function sendSuccess<T>(
  data: T,
  message = "Request successful",
  status = 200
) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return NextResponse.json(response, { status });
}

export function sendError(
  message = "Something went wrong",
  status = 500,
  errors?: unknown
) {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };

  return NextResponse.json(response, { status });
}

//return sendSuccess(data, "User fetched successfully");
//return sendError("Failed to fetch user", 500, error);