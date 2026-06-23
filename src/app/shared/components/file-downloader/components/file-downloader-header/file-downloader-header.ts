import { Component, computed, inject, input, output } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FileDownloaderRow } from '../../interfaces/file-downloader-row.interface';

@Component({
  selector: 'app-file-downloader-header',
  imports: [FontAwesomeModule],
  templateUrl: './file-downloader-header.html',
  styleUrl: './file-downloader-header.scss',
})
export class FileDownloaderHeader {
  public selectedRows = input<FileDownloaderRow[]>([]);
  public rows = input<FileDownloaderRow[]>();
  public selectAllClicked = output<boolean>();

  private library = inject<FaIconLibrary>(FaIconLibrary);

  protected isAllSelected = computed(() => {
    const total = this.rows()?.length;
    return total !== undefined && total > 0 && this.selectedRows().length === total;
  });

  protected isIndeterminate = computed(() => {
    const len = this.selectedRows().length;
    const total = this.rows()?.length;
    return len > 0 && total !== undefined && len !== total;
  });

  constructor() {
    this.library.addIcons(faDownload);
  }

  public selectAll(event: Event): void {
    event.preventDefault();

    let selectAll;

    const selectedRows = this.selectedRows().length;
    const totalAvailableRows = this.rows()?.filter(row => row.canDownload).length ?? 0;

    if (selectedRows === 0) {
      selectAll = true;
    } else if (selectedRows < totalAvailableRows) {
      selectAll = true;
    } else if (selectedRows === totalAvailableRows) {
      selectAll = false;
    } else {
      selectAll = false
    }

    this.selectAllClicked.emit(selectAll);
  }

  public download(): void {
    const message = this.selectedRows()
      .map(row => {
        const path = row.fields.find(f => f.fieldName === 'path')?.value ?? '';
        const device = row.fields.find(f => f.fieldName === 'device')?.value ?? '';
        return `Path: ${path}\nDevice: ${device}`;
      })
      .join('\n\n');

    alert(message);
  }
}
