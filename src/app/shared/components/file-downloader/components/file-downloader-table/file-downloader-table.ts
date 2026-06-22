import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FileDownloaderRow } from '../../models/file-downloader-row.interface';

@Component({
  selector: 'app-file-downloader-table',
  imports: [],
  templateUrl: './file-downloader-table.html',
  styleUrl: './file-downloader-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDownloaderTable {
  public rows = input<FileDownloaderRow[]>();
  public selectAll = input<boolean | null>();

  public selectedRows = signal<FileDownloaderRow[]>([]);

  public selectedRowsChanged = output<FileDownloaderRow[]>();

  constructor() {
    effect(() => {
      const selectAll = this.selectAll();

      if (selectAll === null || selectAll === undefined) return;
      
      this.toggleAllAvailable(selectAll);
    });
  }

  public handleRowClick(row: FileDownloaderRow): void {
    if (!this.isAvailable(row)) return;

    const current = this.selectedRows();
    const updated = current.includes(row)
      ? current.filter(r => r !== row)
      : [...current, row];

    this.selectedRows.set(updated);
    this.selectedRowsChanged.emit(updated);
  }

  public isAvailable(row: FileDownloaderRow): boolean {
    return row.status === 'available';
  }

  public isSelected(row: FileDownloaderRow): boolean {
    return this.selectedRows().includes(row);
  }

  private toggleAllAvailable(selectAll: boolean): void {
    const selectedRows = selectAll
      ? (this.rows()?.filter(row => row.status === 'available') ?? [])
      : [];

    this.selectedRows.set(selectedRows);
    this.selectedRowsChanged.emit(selectedRows);
  }
}
