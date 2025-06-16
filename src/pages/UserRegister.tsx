import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "@/components/ui/use-toast";

const UserRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [extraPhones, setExtraPhones] = useState([""]);
  const [extraEmails, setExtraEmails] = useState([""]);
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Brasil");
  const [extraAddresses, setExtraAddresses] = useState([]);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const buscarEnderecoPorCEP = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) throw new Error("CEP inválido");

      setStreet(response.data.logradouro || "");
      setCity(response.data.localidade || "");
      setState(response.data.uf || "");
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao buscar CEP",
        description: "Não foi possível buscar o endereço automaticamente.",
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "Verifique os campos de senha e confirmação."
      });
      return;
    }

    if (!captchaToken) {
      toast({
        variant: "destructive",
        title: "Confirme o reCAPTCHA",
        description: "Você precisa confirmar que não é um robô."
      });
      return;
    }

    setLoading(true);
    const fullStreet = `${street}, ${number}${complement ? " - " + complement : ""}`;

    try {
      const response = await axios.post("http://localhost:3000/auth/register/full", {
        name,
        email,
        password,
        phone,
        address: {
          street: fullStreet,
          city,
          state,
          postalCode,
          country,
        },
        extraPhones: extraPhones.filter(p => p.trim() !== ""),
        extraEmails: extraEmails.filter(e => e.trim() !== ""),
        extraAddresses: extraAddresses.filter(a => a.street.trim() !== ""),
        captchaToken
      });

      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Bem-vindo(a), ${response.data.user.name}`,
      });

      navigate("/login");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: err.response?.data?.error || "Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-600 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
        <h1 className="text-2xl text-green-700 font-bold mb-6">Criar Conta</h1>
          <form onSubmit={handleRegister} className="space-y-3 text-left">
            <div>
              <label className="text-sm font-medium block mb-1">Nome *</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">E‑mail *</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {extraEmails.map((p, idx) => (
              <div key={idx}>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={p}
                  onChange={(e) => {
                    const arr = [...extraEmails];
                    arr[idx] = e.target.value;
                    setExtraEmails(arr);
                  }}
                  placeholder="E-mail adicional"
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-medium block mb-1">Senha *</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Confirmar Senha *</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Telefone *</label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Render arrays for extras, if desired */}
            {extraPhones.map((p, idx) => (
              <div key={idx}>
                <input
                  type="tel"
                  className="w-full p-2 border rounded-md"
                  value={p}
                  onChange={(e) => {
                    const arr = [...extraPhones];
                    arr[idx] = e.target.value;
                    setExtraPhones(arr);
                  }}
                  placeholder="Telefone adicional"
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-medium block mb-1">CEP *</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={postalCode}
                onChange={(e) => {
                  setPostalCode(e.target.value);
                  if (e.target.value.length === 8) buscarEnderecoPorCEP(e.target.value);
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Rua *</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                className="w-1/3 p-2 border rounded-md"
                placeholder="Número"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
              <input
                type="text"
                className="w-2/3 p-2 border rounded-md"
                placeholder="Complemento"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Cidade *</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Estado *</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>


            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LcnJTIrAAAAAGIhtkU_1SDgIgWnPsux4tHwniPL"
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white p-2 rounded-md font-semibold disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Criar conta"}
            </button>
          </form>
        <div className="mt-6">
          <button onClick={() => navigate("/login")} className="w-full bg-yellow-400 text-black py-2 rounded-md font-semibold">
            Já tenho uma conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;