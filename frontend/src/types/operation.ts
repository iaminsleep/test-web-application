export interface Operation {
    uuid: string;
    number: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}