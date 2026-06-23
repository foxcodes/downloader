import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDownloader } from './file-downloader';
import { FileDownloaderRow } from './interfaces/file-downloader-row.interface';
import { FileDownloaderFieldTypeEnum } from './enums/file-downloader-field-type.enum';

const AVAILABLE_ROW_1: FileDownloaderRow = {
  canDownload: true,
  fields: [
    { fieldName: 'checkbox', type: FileDownloaderFieldTypeEnum.Checkbox, id: 'smss.exe' },
    { fieldName: 'name', value: 'smss.exe', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'device', value: 'Daniel', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'path', value: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'status', value: 'available', type: FileDownloaderFieldTypeEnum.Value, isAvailable: true },
  ]
};

const AVAILABLE_ROW_2: FileDownloaderRow = {
  canDownload: true,
  fields: [
    { fieldName: 'checkbox', type: FileDownloaderFieldTypeEnum.Checkbox, id: 'netsh.exe' },
    { fieldName: 'name', value: 'netsh.exe', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'device', value: 'Daniel', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'path', value: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'status', value: 'available', type: FileDownloaderFieldTypeEnum.Value, isAvailable: true },
  ]
};

const SCHEDULED_ROW: FileDownloaderRow = {
  canDownload: false,
  fields: [
    { fieldName: 'checkbox', type: FileDownloaderFieldTypeEnum.Checkbox, id: 'uxtheme.dll' },
    { fieldName: 'name', value: 'uxtheme.dll', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'device', value: 'Tester', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'path', value: '\\Device\\HarddiskVolume2\\Windows\\System32\\uxtheme.dll', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'status', value: 'scheduled', type: FileDownloaderFieldTypeEnum.Value, isAvailable: false },
  ]
};

const ALL_ROWS = [AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW];

describe('FileDownloader', () => {
  let component: FileDownloader;
  let fixture: ComponentFixture<FileDownloader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDownloader],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDownloader);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('rows', ALL_ROWS);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSelectedRowsChanged', () => {
    it('should update selectedRows with the provided rows', () => {
      component.onSelectedRowsChanged([AVAILABLE_ROW_1]);
      expect(component.selectedRows()).toEqual([AVAILABLE_ROW_1]);
    });

    it('should set selectedRows to an empty array when given an empty array', () => {
      component.onSelectedRowsChanged([AVAILABLE_ROW_1]);
      component.onSelectedRowsChanged([]);
      expect(component.selectedRows()).toEqual([]);
    });

    it('should reset selectAll to null when it was previously set', () => {
      component.onSelectAllClicked(true);
      expect(component.selectAll()).toBe(true);

      component.onSelectedRowsChanged([AVAILABLE_ROW_1]);

      expect(component.selectAll()).toBeNull();
    });

    it('should not change selectAll if it is already null', () => {
      expect(component.selectAll()).toBeNull();
      component.onSelectedRowsChanged([AVAILABLE_ROW_1]);
      expect(component.selectAll()).toBeNull();
    });
  });

  describe('onSelectAllClicked', () => {
    it('should set selectAll to true', () => {
      component.onSelectAllClicked(true);
      expect(component.selectAll()).toBe(true);
    });

    it('should set selectAll to false', () => {
      component.onSelectAllClicked(false);
      expect(component.selectAll()).toBe(false);
    });
  });

  describe('integration: select-all flow', () => {
    it('should propagate select-all=true to the table and update selectedRows to all available rows', async () => {
      component.onSelectAllClicked(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.selectedRows()).toEqual([AVAILABLE_ROW_1, AVAILABLE_ROW_2]);
    });

    it('should propagate select-all=false and clear selectedRows', async () => {
      component.onSelectAllClicked(true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.onSelectAllClicked(false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.selectedRows()).toEqual([]);
    });

    it('should not include scheduled rows when selecting all', async () => {
      component.onSelectAllClicked(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.selectedRows()).not.toContain(SCHEDULED_ROW);
    });
  });
});
