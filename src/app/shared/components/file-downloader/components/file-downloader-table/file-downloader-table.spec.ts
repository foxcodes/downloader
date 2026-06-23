import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDownloaderTable } from './file-downloader-table';
import { FileDownloaderRow } from '../../interfaces/file-downloader-row.interface';
import { FileDownloaderFieldTypeEnum } from '../../enums/file-downloader-field-type.enum';

const AVAILABLE_ROW_1: FileDownloaderRow = {
  canDownload: true,
  fields: [
    { fieldName: 'checkbox', type: FileDownloaderFieldTypeEnum.Checkbox, id: 'smss.exe' },
    { fieldName: 'name', value: 'smss.exe', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'device', value: 'Daniel', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'path', value: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'status', value: 'available', type: FileDownloaderFieldTypeEnum.Status, status: 'available' },
  ]
};

const AVAILABLE_ROW_2: FileDownloaderRow = {
  canDownload: true,
  fields: [
    { fieldName: 'checkbox', type: FileDownloaderFieldTypeEnum.Checkbox, id: 'netsh.exe' },
    { fieldName: 'name', value: 'netsh.exe', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'device', value: 'Daniel', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'path', value: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'status', value: 'available', type: FileDownloaderFieldTypeEnum.Status, status: 'available' },
  ]
};

const SCHEDULED_ROW: FileDownloaderRow = {
  canDownload: false,
  fields: [
    { fieldName: 'checkbox', type: FileDownloaderFieldTypeEnum.Checkbox, id: 'uxtheme.dll' },
    { fieldName: 'name', value: 'uxtheme.dll', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'device', value: 'Tester', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'path', value: '\\Device\\HarddiskVolume2\\Windows\\System32\\uxtheme.dll', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'status', value: 'scheduled', type: FileDownloaderFieldTypeEnum.Status, status: 'loading' },
  ]
};

const ALL_ROWS = [AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW];

describe('FileDownloaderTable', () => {
  let component: FileDownloaderTable;
  let fixture: ComponentFixture<FileDownloaderTable>;

  function getTableRows(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('.file-downloader-table-row');
  }

  function getCheckboxes(): NodeListOf<HTMLInputElement> {
    return fixture.nativeElement.querySelectorAll('.file-downloader-select-checkbox');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDownloaderTable],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDownloaderTable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('rows', ALL_ROWS);
    fixture.componentRef.setInput('selectAll', null);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('row availability', () => {
    it('should disable the checkbox for scheduled rows', () => {
      expect(getCheckboxes()[2].disabled).toBe(true);
    });

    it('should not disable the checkbox for available rows', () => {
      expect(getCheckboxes()[0].disabled).toBe(false);
      expect(getCheckboxes()[1].disabled).toBe(false);
    });

    it('should not select a scheduled row when clicked', () => {
      getTableRows()[2].click();
      fixture.detectChanges();

      expect(component.selectedRows()).toEqual([]);
    });

    it('should not emit selectedRowsChanged when a scheduled row is clicked', () => {
      const spy = vi.spyOn(component.selectedRowsChanged, 'emit');
      getTableRows()[2].click();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('row selection', () => {
    it('should select an available row when clicked', () => {
      getTableRows()[0].click();
      fixture.detectChanges();

      expect(component.selectedRows()).toContain(AVAILABLE_ROW_1);
    });

    it('should deselect a selected row when clicked again', () => {
      getTableRows()[0].click();
      getTableRows()[0].click();
      fixture.detectChanges();

      expect(component.selectedRows()).not.toContain(AVAILABLE_ROW_1);
    });

    it('should allow multiple available rows to be selected independently', () => {
      getTableRows()[0].click();
      getTableRows()[1].click();
      fixture.detectChanges();

      expect(component.selectedRows()).toContain(AVAILABLE_ROW_1);
      expect(component.selectedRows()).toContain(AVAILABLE_ROW_2);
    });

    it('should emit selectedRowsChanged with the updated selection when a row is clicked', () => {
      const spy = vi.spyOn(component.selectedRowsChanged, 'emit');
      getTableRows()[0].click();

      expect(spy).toHaveBeenCalledWith([AVAILABLE_ROW_1]);
    });

    it('should emit an empty array when the last selected row is deselected', () => {
      getTableRows()[0].click();
      const spy = vi.spyOn(component.selectedRowsChanged, 'emit');
      getTableRows()[0].click();

      expect(spy).toHaveBeenCalledWith([]);
    });
  });

  describe('selectAll input', () => {
    it('should select all available rows when selectAll is set to true', () => {
      fixture.componentRef.setInput('selectAll', true);
      fixture.detectChanges();

      expect(component.selectedRows()).toEqual([AVAILABLE_ROW_1, AVAILABLE_ROW_2]);
    });

    it('should not select scheduled rows when selectAll is true', () => {
      fixture.componentRef.setInput('selectAll', true);
      fixture.detectChanges();

      expect(component.selectedRows()).not.toContain(SCHEDULED_ROW);
    });

    it('should deselect all rows when selectAll is set to false', () => {
      fixture.componentRef.setInput('selectAll', true);
      fixture.detectChanges();
      fixture.componentRef.setInput('selectAll', false);
      fixture.detectChanges();

      expect(component.selectedRows()).toEqual([]);
    });

    it('should emit selectedRowsChanged with all available rows when selectAll is true', () => {
      const spy = vi.spyOn(component.selectedRowsChanged, 'emit');
      fixture.componentRef.setInput('selectAll', true);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith([AVAILABLE_ROW_1, AVAILABLE_ROW_2]);
    });

    it('should emit selectedRowsChanged with an empty array when selectAll is false', () => {
      fixture.componentRef.setInput('selectAll', true);
      fixture.detectChanges();
      const spy = vi.spyOn(component.selectedRowsChanged, 'emit');
      fixture.componentRef.setInput('selectAll', false);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith([]);
    });

    it('should not react to a null selectAll value', () => {
      fixture.componentRef.setInput('selectAll', true);
      fixture.detectChanges();
      fixture.componentRef.setInput('selectAll', null);
      fixture.detectChanges();

      expect(component.selectedRows()).toEqual([AVAILABLE_ROW_1, AVAILABLE_ROW_2]);
    });
  });

  describe('status formatting', () => {
    it('should show the status indicator for available rows', () => {
      const indicators = fixture.nativeElement.querySelectorAll('.file-downloader-status-available');

      expect(indicators.length).toBe(2);
    });

    it('should not show the status indicator for scheduled rows', () => {
      const scheduledRowEl: HTMLElement = getTableRows()[2];
      const indicator = scheduledRowEl.querySelector('.file-downloader-status-available');

      expect(indicator).toBeNull();
    });

    it('should render the status cell with the status-available class for available rows', () => {
      const availableRowEl: HTMLElement = getTableRows()[0];
      const statusCell = availableRowEl.querySelector('.file-downloader-table-col-status');

      expect(statusCell).not.toBeNull();
    });

    it('should render the status cell with the loading indicator for scheduled rows', () => {
      const scheduledRowEl: HTMLElement = getTableRows()[2];
      const statusCell = scheduledRowEl.querySelector('.file-downloader-table-col-status');
      const loadingIndicator = scheduledRowEl.querySelector('.file-downloader-status-loading');
      const availableIndicator = scheduledRowEl.querySelector('.file-downloader-status-available');

      expect(statusCell).not.toBeNull();
      expect(loadingIndicator).not.toBeNull();
      expect(availableIndicator).toBeNull();
    });
  });
});
