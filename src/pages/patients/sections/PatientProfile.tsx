// src/pages/patients/sections/PatientProfile.tsx
import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ModalEdit } from "@/components/ModalEdit";
import { ModalAddress } from "@/components/ModalAddress";
import api from "@/lib/api";

type Phone = { id: number; number: string };
type EmailAlt = { id: number; email: string };
type Address = { id: number; street: string; city: string; state: string; postalCode: string; country: string };

type Patient = {
  id: number;
  name: string;
  email: string; // e-mail de login
  cpf: string;
  role: "admin" | "user";
  dataNascimento: string;
  phones?: Phone[];
  emails?: EmailAlt[];     // e-mails alternativos
  addresses?: Address[];
};

function formatCPF(cpf?: string) {
  if (!cpf) return "—";
  const only = cpf.replace(/\D/g, "").slice(0, 11);
  if (only.length !== 11) return cpf;
  return only.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
function formatPhone(v?: string) {
  if (!v) return "—";
  const only = v.replace(/\D/g, "");
  if (only.length === 10) return only.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  if (only.length === 11) return only.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  return v;
}

export default function PatientProfile() {
  const outlet = useOutletContext<{ patient: Patient | null }>();
  const patient = outlet?.patient ?? null;

  // guard contra estado inicial null
  if (!patient) {
    return (
      <Card>
        <CardContent className="py-10 text-sm text-neutral-500">
          Carregando dados do paciente…
        </CardContent>
      </Card>
    );
  }

  // Modais (reaproveitando seus componentes genéricos)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    label: string;
    value: string;
    endpoint: string;
    fieldName: string;
    method?: "put" | "patch" | "post";
  }>({ label: "", value: "", endpoint: "", fieldName: "", method: "put" });

  const [modalAddressOpen, setModalAddressOpen] = useState(false);
  const [modalAddressData, setModalAddressData] = useState<{
    method: "post" | "put";
    endpoint: string;
    initialData?: any;
  }>({ method: "post", endpoint: "", initialData: {} });

  const openField = (label: string, fieldName: string, value: string) => {
    setModalData({
      label,
      value,
      endpoint: `/admin/users/${patient.id}`, // PUT parcial
      fieldName,
      method: "put",
    });
    setModalOpen(true);
  };

  // remoções simples com confirm (opcional: trocar por modal/Toast)
  const removePhone = async (id: number) => {
    if (!confirm("Remover este telefone?")) return;
    await api.delete(`/admin/users/${patient.id}/phones/${id}`);
    window.location.reload();
  };
  const removeEmail = async (id: number) => {
    if (!confirm("Remover este e-mail alternativo?")) return;
    await api.delete(`/admin/users/${patient.id}/emails/${id}`);
    window.location.reload();
  };
  const removeAddress = async (id: number) => {
    if (!confirm("Remover este endereço?")) return;
    await api.delete(`/admin/users/${patient.id}/addresses/${id}`);
    window.location.reload();
  };

  const phones = patient.phones ?? [];
  const emailsAlt = patient.emails ?? [];
  const addresses = patient.addresses ?? [];

  return (
    <>
      <Card>
        <CardContent className="space-y-8">
          <h2 className="text-xl font-bold">🧍 Dados do Paciente</h2>

          {/* Dados sensíveis / cadastrais */}
          <div className="grid gap-3 sm:grid-cols-2">
            <p>
              <strong>Nome:</strong> {patient.name}{" "}
              <Button size="sm" variant="ghost" onClick={() => openField("Nome", "name", patient.name)}>✏️</Button>
            </p>

            <p>
              <strong>CPF:</strong> {formatCPF(patient.cpf)}{" "}
              <Button size="sm" variant="ghost" onClick={() => openField("CPF", "cpf", patient.cpf)}>✏️</Button>
            </p>

            <p>
              <strong>E-mail (login):</strong> {patient.email}{" "}
              <Button size="sm" variant="ghost" onClick={() => openField("E-mail (login)", "email", patient.email)}>✏️</Button>
            </p>

            <p>
              <strong>Nascimento:</strong>{" "}
              {patient.dataNascimento ? new Date(patient.dataNascimento).toLocaleDateString() : "—"}{" "}
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  openField(
                    "Data de nascimento (YYYY-MM-DD)",
                    "dataNascimento",
                    patient.dataNascimento?.slice(0, 10) || ""
                  )
                }
              >
                ✏️
              </Button>
            </p>

            <p className="sm:col-span-2">
              <strong>Tipo de usuário:</strong> {patient.role}{" "}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openField("Tipo de usuário (admin/user)", "role", patient.role)}
              >
                ✏️
              </Button>
            </p>
          </div>

          {/* Credenciais */}
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Credenciais & Acesso</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setModalData({
                    label: "Nova senha",
                    value: "",
                    endpoint: `/admin/users/${patient.id}/password`,
                    fieldName: "password",
                    method: "put",
                  });
                  setModalOpen(true);
                }}
              >
                🔒 Definir nova senha
              </Button>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Esta ação sobrescreve a senha atual do paciente.
            </p>
          </div>

          {/* Telefones */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Telefones</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setModalData({
                    label: "Novo telefone",
                    value: "",
                    endpoint: `/admin/users/${patient.id}/phones`,
                    fieldName: "number",
                    method: "post",
                  });
                  setModalOpen(true);
                }}
              >
                ➕ Novo telefone
              </Button>
            </div>
            {phones.length === 0 ? (
              <p className="text-sm text-neutral-600">Nenhum telefone cadastrado.</p>
            ) : (
              <ul className="space-y-1">
                {phones.map((p) => (
                  <li key={p.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                    {formatPhone(p.number)}
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setModalData({
                            label: "Telefone",
                            value: p.number,
                            endpoint: `/admin/users/${patient.id}/phones/${p.id}`,
                            fieldName: "number",
                            method: "put",
                          });
                          setModalOpen(true);
                        }}
                      >
                        ✏️
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removePhone(p.id)}>🗑️</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* E-mails alternativos */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">E-mails alternativos</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setModalData({
                    label: "Novo e-mail alternativo",
                    value: "",
                    endpoint: `/admin/users/${patient.id}/emails`,
                    fieldName: "email",
                    method: "post",
                  });
                  setModalOpen(true);
                }}
              >
                ➕ Novo e-mail
              </Button>
            </div>
            {emailsAlt.length === 0 ? (
              <p className="text-sm text-neutral-600">Nenhum e-mail alternativo.</p>
            ) : (
              <ul className="space-y-1">
                {emailsAlt.map((e) => (
                  <li key={e.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                    {e.email}
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setModalData({
                            label: "E-mail alternativo",
                            value: e.email,
                            endpoint: `/admin/users/${patient.id}/emails/${e.id}`,
                            fieldName: "email",
                            method: "put",
                          });
                          setModalOpen(true);
                        }}
                      >
                        ✏️
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeEmail(e.id)}>🗑️</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Endereços */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Endereços</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setModalAddressData({
                    method: "post",
                    endpoint: `/admin/users/${patient.id}/addresses`,
                  });
                  setModalAddressOpen(true);
                }}
              >
                ➕ Novo endereço
              </Button>
            </div>
            {addresses.length === 0 ? (
              <p className="text-sm text-neutral-600">Nenhum endereço cadastrado.</p>
            ) : (
              <ul className="space-y-1">
                {addresses.map((a) => (
                  <li key={a.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                    {a.street}, {a.city} - {a.state} • {a.postalCode} • {a.country}
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setModalAddressData({
                            method: "put",
                            endpoint: `/admin/users/${patient.id}/addresses/${a.id}`,
                            initialData: a,
                          });
                          setModalAddressOpen(true);
                        }}
                      >
                        ✏️
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeAddress(a.id)}>🗑️</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </CardContent>
      </Card>

      <ModalEdit
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        {...modalData}
        onSuccess={() => window.location.reload()}
      />

      <ModalAddress
        open={modalAddressOpen}
        onClose={() => setModalAddressOpen(false)}
        {...modalAddressData}
        onSuccess={() => window.location.reload()}
      />
    </>
  );
}
