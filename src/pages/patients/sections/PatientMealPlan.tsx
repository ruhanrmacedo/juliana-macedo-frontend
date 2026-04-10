import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PatientMealPlan() {
  return (
    <Card className="border rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <span>🍽️</span>
              <span>Planejamento Alimentar</span>
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
            Aqui você poderá montar, organizar e acompanhar os planos alimentares
            dos pacientes, incluindo envio e acompanhamento da adesão.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-800 mb-3">
            O que estará disponível neste módulo:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border p-4">
              <p className="font-medium text-sm">Criação de planos alimentares</p>
              <p className="text-sm text-neutral-500 mt-1">
                Montagem de dietas personalizadas para cada paciente.
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="font-medium text-sm">Geração de PDF</p>
              <p className="text-sm text-neutral-500 mt-1">
                Exportação do plano alimentar para envio ao paciente.
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="font-medium text-sm">Envio direto ao paciente</p>
              <p className="text-sm text-neutral-500 mt-1">
                Compartilhamento rápido via WhatsApp ou e-mail.
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="font-medium text-sm">Acompanhamento de adesão</p>
              <p className="text-sm text-neutral-500 mt-1">
                Controle da evolução e ajustes do plano ao longo do tempo.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t pt-4">
          <p className="text-xs text-neutral-500">
            Em breve você poderá criar e gerenciar planos completos diretamente aqui.
          </p>

          <Button disabled variant="outline">
            Disponível em breve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
