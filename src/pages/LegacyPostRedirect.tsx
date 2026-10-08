import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPostById } from "@/lib/posts";
export default function LegacyPostRedirect() {
  const { id } = useParams<{ id: string }>(); const navigate = useNavigate(); const location = useLocation(); const [error, setError] = useState("");
  useEffect(() => { getPostById(Number(id)).then(post => navigate(post.canonicalPath, { replace: true, state: { from: location.pathname } })).catch(() => setError("Conteúdo não encontrado.")); }, [id, navigate, location.pathname]);
  return <div className="p-10 text-center">{error || "Redirecionando para o conteúdo..."}</div>;
}
