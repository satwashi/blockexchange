import { signIn } from "@/utils/auth-client";
import { Button } from "../ui/button";

export default function GoogleLoging() {
  const handleGoogleLogin = async () => {
    // trigger Google OAuth flow
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };
  return (
    <>
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        type="button"
      >
        {/* Full-color Google "G" */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="h-5 w-5"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.72 1.22 9.21 3.6l6.84-6.84C35.33 2.76 29.97 0 24 0 14.6 0 6.47 5.86 2.67 14.06l7.98 6.19C12.43 13.41 17.73 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.1 24.5c0-1.6-.14-3.13-.39-4.62H24v9.25h12.39c-.53 2.71-2.1 5-4.46 6.54l7.02 5.45C43.99 36.97 46.1 31.16 46.1 24.5z"
          />
          <path
            fill="#FBBC05"
            d="M10.65 28.25c-.48-1.42-.74-2.93-.74-4.5s.26-3.08.74-4.5l-7.98-6.19C1.24 15.5 0 19.58 0 23.75s1.24 8.25 3.67 11.69l7.98-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 47.5c6.48 0 11.91-2.13 15.88-5.77l-7.02-5.45c-2.01 1.35-4.58 2.17-8.86 2.17-6.27 0-11.57-3.91-13.35-9.31l-7.98 6.19C6.47 42.14 14.6 47.5 24 47.5z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>

        <span className="font-medium">Login with Google</span>
      </Button>
    </>
  );
}
