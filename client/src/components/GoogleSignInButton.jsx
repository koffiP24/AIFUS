import { GoogleLogin } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const isGoogleConfigured =
  googleClientId && !googleClientId.includes("your-google-client-id");

const GoogleSignInButton = ({
  onSuccess,
  onError,
  text = "signin_with",
}) => {
  if (!isGoogleConfigured) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
        La connexion Google est désactivée tant que{" "}
        <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900/60">
          VITE_GOOGLE_CLIENT_ID
        </code>{" "}
        n&apos;est pas configuré.
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        text={text}
        theme="outline"
        size="large"
        ux_mode="popup"
      />
    </div>
  );
};

export default GoogleSignInButton;
