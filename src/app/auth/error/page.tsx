"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    Default: "An error occurred during authentication.",
  };

  const message = error ? (errorMessages[error] ?? errorMessages.Default) : errorMessages.Default;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4">
      <div className="w-full rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-red-800">Authentication Error</h1>
        <p className="mb-6 text-sm text-red-600">{message}</p>
        <Link
          href="/auth/login"
          className="rounded-lg bg-aqua-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-aqua-700"
        >
          Try Again
        </Link>
      </div>
      <Link href="/" className="mt-6 text-sm text-gray-500 hover:text-aqua-600">
        &larr; Back to home
      </Link>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
