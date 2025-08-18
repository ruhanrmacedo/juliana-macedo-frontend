export default function ConfirmUpdate({
    open,
    text = "Atualizar suas métricas com esses valores?",
    onConfirm,
    onCancel,
}: {
    open: boolean;
    text?: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[1000] bg-black/40 grid place-items-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <h4 className="font-heading font-bold text-lg mb-2">Confirmar</h4>
                <p className="text-gray-700">{text}</p>
                <div className="mt-6 flex justify-end gap-2">
                    <button className="px-4 py-2 rounded-lg border" onClick={onCancel}>
                        Não, obrigado
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-primary text-white" onClick={onConfirm}>
                        Sim, atualizar
                    </button>
                </div>
            </div>
        </div>
    );
}
