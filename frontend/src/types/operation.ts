export interface Operation {
    uuid: string;
    number: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Suboperation {
    uuid: string;
    name: string;
    number: string;
    operation_uuid: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}