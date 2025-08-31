// src/types/domain.ts
export type UserRole = "admin" | "user";

export type UserPhone = { id: number; number: string };
export type UserEmail = { id: number; email: string };
export type UserAddress = {
    id: number;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};

export type UserMe = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    cpf: string;
    dataNascimento: string; // ISO
    phones: UserPhone[];
    addresses: UserAddress[];
    emails: UserEmail[];
};

export type Sexo = "M" | "F";

export type UserMetrics = {
    id: number;
    peso: number;
    altura: number;
    idade: number;
    sexo: Sexo;
    nivelAtividade: string;
    gorduraCorporal?: number | null;
    createdAt: string; // ISO
};
