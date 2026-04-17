import { useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleSignInButton = ({ onSuccess, onError }) => {
  const login = useGoogleLogin({
    onSuccess,
    onError,
    flow: "implicit",
  });

  const handleClick = useCallback(() => {
    login();
  }, [login]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#4285F4"
          d="M23.64 12.205c0-.78-.07-1.53-.196-2.255H12.5v4.265h6.37c-.275 1.48-1.1 2.73-2.35 3.57v2.96h3.8c2.22-2.05 3.5-5.06 3.5-8.54z"
        />
        <path
          fill="#34A853"
          d="M12.5 24c3.24 0 5.96-1.07 7.95-2.92l-3.8-2.96c-1.05.7-2.4 1.11-4.14 1.11-3.18 0-5.88-2.15-6.84-5.05H1.7v3.17C3.67 21.98 7.74 24 12.5 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.66 14.18c-.24-.7-.38-1.45-.38-2.18 0-.73.14-1.44.38-2.12V6.81H1.7C.62 8.69 0 10.78 0 12.99c0 2.2.62 4.28 1.7 6.18l3.96-3z"
        />
        <path
          fill="#EA4335"
          d="M12.5 4.78c1.76 0 3.36.61 4.62 1.8l3.47-3.47C18.44 1.14 15.74 0 12.5 0 7.74 0 3.67 2.02 1.7 5.01l3.96 3.07c.96-2.9 3.66-5.05 6.84-5.05z"
        />
      </svg>
      <span>Se connecter avec Google</span>
    </button>
  );
};

export default GoogleSignInButton;
