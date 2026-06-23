import { FileDownloaderField } from "./file-dowloader-field.interface";

export interface FileDownloaderRow {
    fields: FileDownloaderField[],
    canDownload?: boolean;
}