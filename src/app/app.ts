import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileDownloader } from './shared/components/file-downloader/file-downloader';
import { ThreatService } from './services/threat-service/threat.service';
import { FileDownloaderRow } from './shared/components/file-downloader/interfaces/file-downloader-row.interface';
import { FileDownloaderColDef } from './shared/components/file-downloader/interfaces/file-downloader-col-def.interface';
import { Threat } from './models/threat.interface';
import { FileDownloaderFieldTypeEnum } from './shared/components/file-downloader/enums/file-downloader-field-type.enum';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FileDownloader],
  providers: [ThreatService],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('downloader');

  public isLoading = signal<boolean>(true);
  public rows = signal<FileDownloaderRow[]>([]);
  public colDef = signal<FileDownloaderColDef[]>([{
    headerName: '',
    fieldName: 'checkbox'
  }, {
    headerName: 'Name',
    fieldName: 'name'
  }, {
    headerName: 'Device',
    fieldName: 'device'
  }, {
    headerName: 'Path',
    fieldName: 'path'
  }, {
    headerName: 'Status',
    fieldName: 'status',
  }]);

  private threatService = inject(ThreatService);

  async ngOnInit() {
    const threats: Threat[] = await this.threatService.getThreats();
    const rowData: FileDownloaderRow[] = threats.map(threat => {
      return {
        canDownload: threat.status === 'available',
        isAvailable: threat.status === 'available',
        fields: [{
            fieldName: 'checkbox',
            type: FileDownloaderFieldTypeEnum.Checkbox,
            id: threat.name
          }, {
            fieldName: 'name',
            value: threat.name,
            type: FileDownloaderFieldTypeEnum.Value
          }, {
            fieldName: 'device',
            value: threat.device,
            type: FileDownloaderFieldTypeEnum.Value
          }, {
            fieldName: 'path',
            value: threat.path,
            type: FileDownloaderFieldTypeEnum.Value
          }, {
            fieldName: 'status',
            value: threat.status,
            type: FileDownloaderFieldTypeEnum.Status,
            status: threat.status === 'available' ? 'available' : 'loading'
        }]
      };
    });

    this.rows.set(rowData);
    this.isLoading.set(false);
  }  

  public onDownloadSelected(selectedRows: FileDownloaderRow[]): void {
    const message = selectedRows
      .map(row => {
        const path = row.fields.find(f => f.fieldName === 'path')?.value ?? '';
        const device = row.fields.find(f => f.fieldName === 'device')?.value ?? '';
        return `Path: ${path}\nDevice: ${device}`;
      })
      .join('\n\n'); 

      alert(message);
  }
}
