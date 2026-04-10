import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PatientAnamneses() {
  return (
    <Card className="border rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <span>📝</span>
              <span>Anamneses</span>
            </CardTitle>
            <p className="text-sm text-neutral-500 mt-1">
              Este módulo está em desenvolvimento e será disponibilizado em breve.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium text-amber-700 bg-amber-50 border-amber-200">
            Em construção
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-xl border bg-neutral-50 p-4">
          <p className="text-sm text-neutral-700">
            Aqui você poderá registrar e acompanhar as informações iniciais e
            complementares do paciente de forma organizada.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-800 mb-3">
            O que estará disponível neste módulo:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border p-4">
              <p className="font-medium text-sm">Histórico clínico</p>
              <p className="text-sm text-neutral-500 mt-1">
                Registro de sintomas, queixas e condições relevantes.
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="font-medium text-sm">Hábitos e rotina</p>
              <p className="text-sm text-neutral-500 mt-1">
                Alimentação, sono, atividade física e rotina do paciente.
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="font-medium text-sm">Objetivos do acompanhamento</p>
              <p className="text-sm text-neutral-500 mt-1">
                Metas definidas para o plano de cuidado nutricional.
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="font-medium text-sm">Anotações profissionais</p>
              <p className="text-sm text-neutral-500 mt-1">
                Observações importantes para evolução e conduta.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t pt-4">
          <p className="text-xs text-neutral-500">
            Prioridade temporariamente direcionada para outras áreas do sistema.
          </p>

          <Button disabled variant="outline">
            Disponível em breve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}