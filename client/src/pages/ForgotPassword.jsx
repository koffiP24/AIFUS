import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";

const schema = z.object({
  email: z.string().email("Email invalide"),
});

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", {
        email: data.email,
      });
      setMessage(
        res.data.message ||
          "Un lien de réinitialisation a été envoyé si cet email existe.",
      );
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de l'envoi du lien."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-4">Mot de passe oublié</h1>
        <p className="text-slate-500 mb-6">
          Entrez votre adresse email et nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
        </p>

        {message && (
          <div className="mb-4 rounded-xl bg-green-50 text-green-800 border border-green-200 p-4">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 text-red-800 border border-red-200 p-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email")}
              className="input-field w-full"
              placeholder="votre.email@mail.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading
              ? "Envoi en cours..."
              : "Envoyer le lien de réinitialisation"}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-500">
          <Link to="/login" className="text-primary-600 hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
