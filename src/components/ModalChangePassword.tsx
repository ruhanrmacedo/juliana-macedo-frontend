import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

interface ModalChangePasswordProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ModalChangePassword({
    open,
    onClose,
    onSuccess,
}: ModalChangePasswordProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSave = async () => {
        try {
            if (!currentPassword || !newPassword || !confirmPassword) {
                alert("Preencha todos os campos.");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("A confirmação da nova senha não confere.");
                return;
            }

            if (newPassword.length < 6) {
                alert("A nova senha deve ter pelo menos 6 caracteres.");
                return;
            }

            setLoading(true);

            await api.post("/auth/change-password", {
                currentPassword,
                newPassword,
                confirmPassword,
            });

            alert("Senha alterada com sucesso.");
            handleClose();
            onSuccess?.();
        } catch (err: unknown) {
            console.error("Erro ao alterar senha:", getErrorMessage(err));
            alert(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Alterar senha</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <Input
                        type="password"
                        placeholder="Senha atual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Confirmar nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Salvando..." : "Salvar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}