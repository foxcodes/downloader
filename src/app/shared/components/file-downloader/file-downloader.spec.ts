import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDownloader } from './file-downloader';
import { FileDownloaderRow } from './models/file-downloader-row.interface';

const AVAILABLE_ROW_1: FileDownloaderRow = { name: 'smss.exe', device: 'Daniel', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', status: 'available' };
const AVAILABLE_ROW_2: FileDownloaderRow = { name: 'netsh.exe', device: 'Daniel', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', status: 'available' };
const SCHEDULED_ROW: FileDownloaderRow = { name: 'uxtheme.dll', device: 'Tester', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\uxtheme.dll', status: 'scheduled' };
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
