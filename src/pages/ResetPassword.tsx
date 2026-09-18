import { FormEvent, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { MIN_PASSWORD_LENGTH, PASSWORD_POLICY_MESSAGE } from "@/lib/passwordPolicy";
import { useAuth } from "@/hooks/useAuth";
import {
  capturePasswordResetToken,
  clearPasswordResetFragment,
} from "@/lib/passwordResetFragment";

const ResetPassword = () => {
  const [{ token, cleanUrl }] = useState(() =>
    capturePasswordResetToken(window.location)
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useAuth();

  useLayoutEffect(() => {
    clearPasswordResetFragment(window.history, cleanUrl);
  }, [cleanUrl]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Link de redefinição inválido ou incompleto.");
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(PASSWORD_POLICY_MESSAGE);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("A confirmação da nova senha não confere.");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/auth/reset-password", { token, newPassword, confirmPassword });
      logout();
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Não foi possível redefinir a senha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-600 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl text-green-700 font-bold mb-3 text-center">Redefinir senha</h1>
        {success ? (
          <div className="text-center space-y-4">
            <p className="text-green-700">Sua senha foi redefinida com sucesso. Faça login novamente.</p>
            <Link to="/login" className="block w-full bg-green-700 text-white p-2 rounded-md font-semibold">Ir para o login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 text-center">Informe uma nova senha com pelo menos {MIN_PASSWORD_LENGTH} caracteres.</p>
            <div>
              <label className="text-sm font-medium block mb-1">Nova senha *</label>
              <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" className="w-full p-2 border rounded-md" required />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Confirmar nova senha *</label>
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" className="w-full p-2 border rounded-md" required />
            </div>
            {!token && <p className="text-red-600 text-sm">Este link não contém um token válido. Solicite um novo link.</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={isSubmitting || !token} className="w-full bg-green-700 text-white p-2 rounded-md font-semibold disabled:opacity-50">
              {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
            </button>
            <Link to="/login" className="block text-center text-sm text-green-800 hover:underline">Voltar ao login</Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
