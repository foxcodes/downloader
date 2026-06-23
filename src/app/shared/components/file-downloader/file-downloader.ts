import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FileDownloaderHeader } from './components/file-downloader-header/file-downloader-header';
import { FileDownloaderRow } from './interfaces/file-downloader-row.interface';
import { FileDownloaderTable } from './components/file-downloader-table/file-downloader-table';
import { FileDownloaderColDef } from './interfaces/file-downloader-col-def.interface';

@Component({
  selector: 'app-file-downloader',
  imports: [FileDownloaderHeader, FileDownloaderTable],
  templateUrl: './file-downloader.html',
  styleUrl: './file-downloader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDownloader {
  public rows = input<FileDownloaderRow[]>();
  public colDef = input<FileDownloaderColDef[]>([])

  public downloadSelected = output<FileDownloaderRow[]>();

  public selectedRows = signal<FileDownloaderRow[]>([]);
  public selectAll = signal<boolean | null>(null);

  public onSelectedRowsChanged(selectedRows: FileDownloaderRow[]): void {
    this.selectedRows.set(selectedRows?.length ? selectedRows : []);

    if (this.selectAll() !== null) {
      this.selectAll.set(null);
    }
  }

  public onSelectAllClicked(isChecked: boolean): void {
    this.selectAll.set(isChecked);
  }

  public onDownloadSelectedClicked(selectedRows: FileDownloaderRow[]): void {
    this.downloadSelected.emit(selectedRows);
  }
}
