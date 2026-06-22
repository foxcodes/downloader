export interface FileDownloaderRow {
    name: string;
    device: string;
    path: string;
    status: 'scheduled' | 'available';
}