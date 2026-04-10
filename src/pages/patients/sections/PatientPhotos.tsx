import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PatientsPhotos() {
  return (
    <Card className="border rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <span>📸</span>
              <span>Fotos do Paciente</span>
            </CardTitle>
            <p className="text-sm text-neutral-500 mt-1">
              Este módulo está em desenvolvimento e será disponibilizado em breve.
            </p>
          </div>

          <span className="inline-flex rounded-full border px-3 py-1 text-xs font-medium text-amber-700 bg-amber-50 border-amber-200">
            Em construção
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-xl border bg-neutral-50 p-4">
          <p className="text-sm text-neutral-700">
            Aqui você poderá acompanhar a evolução visual do paciente através de fotos organizadas por data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border p-4">
            <p className="font-medium text-sm">Upload de fotos</p>
            <p className="text-sm text-neutral-500 mt-1">
              Envio de imagens de evolução do paciente.
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="font-medium text-sm">Comparação visual</p>
            <p className="text-sm text-neutral-500 mt-1">
              Visualização lado a lado (antes e depois).
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="font-medium text-sm">Linha do tempo</p>
            <p className="text-sm text-neutral-500 mt-1">
              Organização cronológica das fotos.
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="font-medium text-sm">Privacidade</p>
            <p className="text-sm text-neutral-500 mt-1">
              Controle de acesso às imagens do paciente.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <p className="text-xs text-neutral-500">
            Em breve disponível para acompanhamento visual completo.
          </p>
          <Button disabled variant="outline">
            Disponível em breve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}