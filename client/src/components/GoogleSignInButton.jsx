import { useEffect, useRef } from "react";

const GoogleSignInButton = ({ clientId, onSuccess }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!clientId) {
      return;
    }

    const scriptId = "google-identity-service-script";
    const initGoogleButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (credentialResponse) => {
          if (credentialResponse?.credential) {
            onSuccess(credentialResponse.credential);
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
      });
    };

    const script = document.getElementById(scriptId);
    if (script) {
      if (window.google?.accounts?.id) {
        initGoogleButton();
      } else {
        script.addEventListener("load", initGoogleButton);
      }
      return;
    }

    const newScript = document.createElement("script");
    newScript.id = scriptId;
    newScript.src = "https://accounts.google.com/gsi/client";
    newScript.async = true;
    newScript.defer = true;
    newScript.onload = initGoogleButton;
    document.body.appendChild(newScript);

    return () => {
      newScript.removeEventListener("load", initGoogleButton);
    };
  }, [clientId, onSuccess]);

  if (!clientId) {
    return (
      <div className="text-sm text-slate-500">
        Google Client ID non configuré.
      </div>
    );
  }

  return <div ref={buttonRef} />;
};

export default GoogleSignInButton;
