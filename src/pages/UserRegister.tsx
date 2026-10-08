import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import { createBasicRegistrationPayload } from "@/lib/authFlows";
import { MIN_PASSWORD_LENGTH, PASSWORD_POLICY_MESSAGE } from "@/lib/passwordPolicy";
import { getErrorMessage } from "@/lib/errors";

const UserRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast({ variant: "destructive", title: "Senha inválida", description: PASSWORD_POLICY_MESSAGE });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "Verifique os campos de senha e confirmação.",
      });
      return;
    }
    if (!captchaToken) {
      toast({
        variant: "destructive",
        title: "Confirme o reCAPTCHA",
        description: "Você precisa confirmar que não é um robô.",
      });
      return;
    }

    try {
      setLoading(true);
      await api.post(
        "/auth/register",
        createBasicRegistrationPayload({ name, email, password, confirmPassword, captchaToken }),
      );
      toast({
        title: "Conta criada com sucesso!",
        description: "Faça login para continuar.",
      });
      navigate("/login");
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: getErrorMessage(error) || "Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-600 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl text-green-700 font-bold mb-2 text-center">Criar conta</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Comece com seus dados básicos. Informações de saúde e métricas são opcionais.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="register-name" className="text-sm font-medium block mb-1">Nome *</label>
            <input
              id="register-name"
              type="text"
              className="w-full p-2 border rounded-md"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label htmlFor="register-email" className="text-sm font-medium block mb-1">E-mail *</label>
            <input
              id="register-email"
              type="email"
              className="w-full p-2 border rounded-md"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label htmlFor="register-password" className="text-sm font-medium block mb-1">Senha *</label>
            <input
              id="register-password"
              type="password"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              required
            />
          </div>
          <div>
            <label htmlFor="register-confirm-password" className="text-sm font-medium block mb-1">
              Confirmar senha *
            </label>
            <input
              id="register-confirm-password"
              type="password"
              className="w-full p-2 border rounded-md"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LcnJTIrAAAAAGIhtkU_1SDgIgWnPsux4tHwniPL"
              onChange={setCaptchaToken}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white p-2 rounded-md font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-4 w-full bg-yellow-400 text-black py-2 rounded-md font-semibold"
        >
          Já tenho uma conta
        </button>
      </div>
    </div>
  );
};

export default UserRegister;
