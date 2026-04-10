import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PatientsHistory() {
  return (
    <Card className="border rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <span>📜</span>
              <span>Histórico do Paciente</span>
            </CardTitle>
            <p className="text-sm text-neutral-500 mt-1">
              Este módulo está em desenvolvimento.
            </p>
          </div>

          <span className="rounded-full border px-3 py-1 text-xs text-amber-700 bg-amber-50 border-amber-200">
            Em construção
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-xl border bg-neutral-50 p-4">
          <p className="text-sm text-neutral-700">
            Aqui você poderá acompanhar toda a evolução do paciente ao longo do tempo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="border rounded-xl p-4">
            <p className="font-medium text-sm">Linha do tempo</p>
            <p className="text-sm text-neutral-500 mt-1">
              Registro de consultas e atendimentos.
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="font-medium text-sm">Evolução clínica</p>
            <p className="text-sm text-neutral-500 mt-1">
              Histórico de mudanças e progresso.
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="font-medium text-sm">Registros anteriores</p>
            <p className="text-sm text-neutral-500 mt-1">
              Acesso a dados passados do paciente.
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="font-medium text-sm">Observações</p>
            <p className="text-sm text-neutral-500 mt-1">
              Anotações feitas durante o acompanhamento.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <p className="text-xs text-neutral-500">
            Histórico completo disponível em breve.
          </p>
          <Button disabled variant="outline">
            Disponível em breve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}