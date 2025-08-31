import { useState } from "react";
import api from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import InputMask from "react-input-mask";
import { getErrorMessage } from "@/lib/errors";

type RecaptchaValue = string | null;
type HtmlInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState<RecaptchaValue>(null);
  const { setUser } = useAuth();
  const [showRecoverEmail, setShowRecoverEmail] = useState(false);
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [emailRecuperado, setEmailRecuperado] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaToken) {
      const msg = "Você precisa confirmar que não é um robô.";
      setError(msg);
      toast({ title: "Erro", description: msg, variant: "destructive" });
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        captchaToken,
      });

      const token: string = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);

      const check = await api.get("/metrics/check", {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(check.data.hasMetrics ? "/" : "/metrics");
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err) || "Erro ao fazer login";
      setError(errorMsg);
      toast({ title: "Erro no login", description: errorMsg, variant: "destructive" });
    }
  };

  const handleRecoverEmail = async () => {
    if (!cpf || !dataNascimento) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o CPF e a data de nascimento.",
        variant: "destructive",
      });
      return;
    }

    const parsedDate = new Date(dataNascimento);
    if (isNaN(parsedDate.getTime())) {
      toast({
        title: "Data inválida",
        description: "Informe uma data de nascimento válida.",
        variant: "destructive",
      });
      return;
    }

    const dataFormatada = parsedDate.toISOString().split("T")[0];

    try {
      const response = await api.post("/auth/recover-email", {
        cpf,
        dataNascimento: dataFormatada,
      });

      setEmailRecuperado(response.data.email);
      setCpf("");
      setDataNascimento("");
      toast({ title: "E-mail encontrado", description: `E-mail: ${response.data.email}` });
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err) || "Erro ao recuperar e-mail";
      toast({ title: "Erro", description: errorMsg, variant: "destructive" });
    }
  };

  const handleForgotPassword = async () => {
    if (!emailRecuperacao) {
      toast({
        title: "E-mail obrigatório",
        description: "Informe o e-mail para recuperar a senha.",
        variant: "destructive",
      });
      return;
    }

    if (!window.confirm("Uma nova senha será gerada e enviada para o e-mail informado. Deseja continuar?"))
      return;

    try {
      await api.post("/auth/forgot-password", { email: emailRecuperacao });
      toast({ title: "Senha redefinida", description: "Uma nova senha foi enviada ao seu e-mail." });
      setEmailRecuperacao("");
      setShowForgotPassword(false);
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err) || "Erro ao recuperar senha";
      toast({ title: "Erro", description: errorMsg, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-600 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl text-green-700 font-bold mb-6">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="text-sm font-medium block mb-1">Seu e-mail cadastrado *</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Sua senha *</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LcnJTIrAAAAAGIhtkU_1SDgIgWnPsux4tHwniPL"
              onChange={(token: RecaptchaValue) => setCaptchaToken(token)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-700 text-white p-2 rounded-md font-semibold disabled:opacity-50"
            disabled={!captchaToken}
          >
            Fazer login
          </button>
        </form>

        {showRecoverEmail && (
          <div className="mt-6 text-left border-t pt-4">
            <h2 className="text-green-700 font-bold mb-2 text-center">Recuperar e-mail</h2>

            <div className="mb-2">
              <label className="text-sm block mb-1">CPF *</label>
              <InputMask
                mask="999.999.999-99"
                value={cpf}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpf(e.target.value)}
              >
                {(inputProps) => (
                  <input
                    {...(inputProps as HtmlInputProps)}
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="000.000.000-00"
                  />
                )}
              </InputMask>
            </div>

            <div className="mb-4">
              <label className="text-sm block mb-1">Data de nascimento *</label>
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={dataNascimento}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDataNascimento(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <button onClick={handleRecoverEmail} className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold">
              Recuperar e-mail
            </button>

            {emailRecuperado && (
              <p className="mt-2 text-green-700 font-medium text-center">
                E-mail cadastrado: <strong>{emailRecuperado}</strong>
              </p>
            )}
          </div>
        )}

        {showForgotPassword && (
          <div className="mt-6 text-left border-t pt-4">
            <h2 className="text-green-700 font-bold mb-2 text-center">Recuperar senha</h2>

            <div className="mb-4">
              <label className="text-sm block mb-1">E-mail cadastrado *</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="Digite seu e-mail"
                value={emailRecuperacao}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailRecuperacao(e.target.value)}
              />
            </div>

            <button onClick={handleForgotPassword} className="w-full bg-red-600 text-white p-2 rounded-md font-semibold">
              Enviar nova senha
            </button>
          </div>
        )}

        <div className="mt-4 space-y-2 text-sm text-green-800 font-medium">
          <a
            href="#"
            onClick={() => {
              setShowRecoverEmail(false);
              setShowForgotPassword(true);
            }}
            className="block hover:underline text-center"
          >
            Esqueci minha senha
          </a>

          <a
            href="#"
            onClick={() => {
              setShowForgotPassword(false);
              setShowRecoverEmail(true);
            }}
            className="block hover:underline text-center"
          >
            Esqueci meu e-mail
          </a>
        </div>

        <div className="mt-6">
          <Link to="/register" className="block w-full bg-yellow-400 text-black py-2 rounded-md font-semibold text-center">
            Ainda não tenho cadastro
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;