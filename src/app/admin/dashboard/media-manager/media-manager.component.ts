import { Component, OnInit, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import { MediaManagerService } from './media-manager.service';

@Component({
  selector: 'blog-media-manager',
  templateUrl: 'media-manager.component.html',
  styleUrls: ['media-manager.component.scss']
})

export class MediaManagerComponent implements OnInit {
  @Input() editPostMode = false;
  @Output() selectedFile: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('fileInput') fileInput: ElementRef;

  public filesList: {}[] = [];
  public uploadFileForm: FormGroup;

  constructor(public mediaManagerService: MediaManagerService, public fb: FormBuilder) { }

  ngOnInit() {
    this.uploadFileForm = this.fb.group({
      file: [{ value: '', disabled: false }, [Validators.required]]
    });
    this.getList();
  }

  chooseFile() {
    // console.log('asdasd');
    this.fileInput.nativeElement.click();
  }

  selectFile(fileName: string) {
    if (this.editPostMode) {
      this.selectedFile.emit(`media/${fileName}`);
    }
  }

  getList() {
    this.mediaManagerService.getList().subscribe(res => {
      if (res) {
        this.filesList = res;
      }
    });
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.uploadFileForm.value.file);
    this.mediaManagerService.uploadFile(formData).subscribe(res => {
      this.uploadFileForm.reset();
      if (res) {
        this.getList();
      }
    });
  }

  deleteFile(fileName: string) {
    this.mediaManagerService.deleteFile(fileName).subscribe(res => {
      if (res) {
        this.getList();
      }
    });
  }
}
