export interface Threat {
    name: string;
    device: string;
    path: string;
    status: 'scheduled' | 'available';
}