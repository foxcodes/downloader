import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FileDownloaderRow } from '../../interfaces/file-downloader-row.interface';
import { FileDownloaderColDef } from '../../interfaces/file-downloader-col-def.interface';
import { FileDownloaderFieldTypeEnum } from '../../enums/file-downloader-field-type.enum';

@Component({
  selector: 'app-file-downloader-table',
  imports: [],
  templateUrl: './file-downloader-table.html',
  styleUrl: './file-downloader-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDownloaderTable {
  public colDef = input<FileDownloaderColDef[]>([]);
  public rows = input<FileDownloaderRow[]>();
  public selectAll = input<boolean | null>();

  public selectedRows = signal<FileDownloaderRow[]>([]);

  public selectedRowsChanged = output<FileDownloaderRow[]>();
  public fileDownloaderFieldTypeEnum = FileDownloaderFieldTypeEnum;

  constructor() {
    effect(() => {
      const selectAll = this.selectAll();

      if (selectAll === null || selectAll === undefined) return;

      this.toggleAllAvailable(selectAll);
    });
  }

  public handleRowClick(row: FileDownloaderRow): void {
    if (!row.canDownload) return;

    const current = this.selectedRows();
    const updated = current.includes(row)
      ? current.filter(r => r !== row)
      : [...current, row];

    this.selectedRows.set(updated);
    this.selectedRowsChanged.emit(updated);
  }


  public isSelected(row: FileDownloaderRow): boolean {
    return this.selectedRows().includes(row);
  }

  private toggleAllAvailable(selectAll: boolean): void {
    const selectedRows = selectAll
      ? (this.rows()?.filter(row => row.canDownload) ?? [])
      : [];

    this.selectedRows.set(selectedRows);
    this.selectedRowsChanged.emit(selectedRows);
  }
}
