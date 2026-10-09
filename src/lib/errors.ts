import axios, { AxiosError } from "axios";

type ApiErrorBody = { error?: string; message?: string };

export function getErrorMessage(err: unknown, fallback?: string): string {
    if (axios.isAxiosError(err)) {
        const ax = err as AxiosError<ApiErrorBody>;
        return (
            ax.response?.data?.error ||
            ax.response?.data?.message ||
            fallback ||
            ax.message ||
            "Erro inesperado na requisição."
        );
    }
    if (err instanceof Error) return fallback || err.message;
    return fallback || "Erro desconhecido.";
}

export function getStatus(err: unknown): number | undefined {
    if (axios.isAxiosError(err)) {
        return err.response?.status;
    }
    return undefined;
}
