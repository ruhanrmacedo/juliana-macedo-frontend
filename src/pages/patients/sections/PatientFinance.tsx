import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PatientFinance() {
  return (
    <Card className="border rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <span>💳</span>
              <span>Financeiro</span>
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
            Aqui você poderá gerenciar cobranças, pagamentos e o financeiro dos atendimentos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="border rounded-xl p-4">
            <p className="font-medium text-sm">Controle de pagamentos</p>
            <p className="text-sm text-neutral-500 mt-1">
              Registro de pagamentos realizados.
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="font-medium text-sm">Cobranças</p>
            <p className="text-sm text-neutral-500 mt-1">
              Controle de valores pendentes.
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="font-medium text-sm">Recibos</p>
            <p className="text-sm text-neutral-500 mt-1">
              Emissão de comprovantes.
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="font-medium text-sm">Resumo financeiro</p>
            <p className="text-sm text-neutral-500 mt-1">
              Visão geral dos atendimentos pagos.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <p className="text-xs text-neutral-500">
            Em breve você poderá gerenciar tudo em um só lugar.
          </p>
          <Button disabled variant="outline">
            Disponível em breve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}