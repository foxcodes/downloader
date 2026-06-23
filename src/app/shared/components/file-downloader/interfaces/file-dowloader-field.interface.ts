import { FileDownloaderFieldTypeEnum } from "../enums/file-downloader-field-type.enum";

export interface FileDownloaderField {
    type: FileDownloaderFieldTypeEnum;
    fieldName: string;
    value?: any;
    isAvailable?: boolean;
    id?: string;
    status?: 'available' | 'unavailable' | 'loading'
} 