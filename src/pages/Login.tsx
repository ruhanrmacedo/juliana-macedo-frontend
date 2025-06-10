import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("Você precisa confirmar que não é um robô.");
      toast({
        title: "Erro",
        description: "Você precisa confirmar que não é um robô.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
        captchaToken,
      });

      localStorage.setItem("token", response.data.token);
      toast({
        title: "Login realizado!",
        description: `Bem-vindo, ${response.data.user.name}!`,
      });
      navigate("/");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Erro ao fazer login";
      setError(errorMsg);
      toast({
        title: "Erro no login",
        description: errorMsg,
        variant: "destructive",
      });
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
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Sua senha *</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LcnJTIrAAAAAGIhtkU_1SDgIgWnPsux4tHwniPL"
              onChange={(token) => setCaptchaToken(token)}
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

        <div className="mt-4 space-y-2 text-sm text-green-800 font-medium">
          <a href="#" className="block hover:underline text-center">Esqueci minha senha</a>
          <a href="#" className="block hover:underline text-center">Esqueci meu e-mail</a>
        </div>

        <div className="mt-6">
          <Link
            to="/register"
            className="block w-full bg-yellow-400 text-black py-2 rounded-md font-semibold text-center"
          >
            Ainda não tenho cadastro
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
