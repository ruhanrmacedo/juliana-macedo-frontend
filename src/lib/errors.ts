import axios, { AxiosError } from "axios";

type ApiErrorBody = { error?: string; message?: string };

export function getErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        const ax = err as AxiosError<ApiErrorBody>;
        return (
            ax.response?.data?.error ||
            ax.response?.data?.message ||
            ax.message ||
            "Erro inesperado na requisição."
        );
    }
    if (err instanceof Error) return err.message;
    return "Erro desconhecido.";
}