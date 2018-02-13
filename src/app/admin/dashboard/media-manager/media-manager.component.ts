import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import { MediaManagerService } from './media-manager.service';

@Component({
  selector: 'blog-media-manager',
  templateUrl: 'media-manager.component.html'
})

export class MediaManagerComponent implements OnInit {
  @Input() editPostMode = false;
  @Output() selectFile: EventEmitter<string> = new EventEmitter<string>();

  public filesList: {}[] = [];
  public selectedItem: any = {};
  public uploadFileForm: FormGroup;

  constructor(public mediaManagerService: MediaManagerService, public fb: FormBuilder, private el: ElementRef) { }

  ngOnInit() {
    this.uploadFileForm = this.fb.group({
      file: [{ value: '', disabled: false }, [Validators.required]]
      // path: [{ value: '', disabled: false }, [Validators.required]]
    });

    this.getList();
  }

  selectItem(item: any) {
    this.selectedItem = item;
    // if (this.selectedItem.type === 'directory') {
    //   if (this.selectedItem.path === './media') {
    //     this.setFolderPath('/');
    //   } else {
    //     let path = item.path.substring(6);
    //     this.setFolderPath(path);
    //   }
    // } else {
    //   this.setFolderPath('');
      if (this.editPostMode) {
        this.selectFile.emit(`media/${item.name}`);
      }
    // }
  }

  // setFolderPath(path: string) {
  //   this.uploadFileForm.patchValue({
  //     path: path
  //   });
  // }

  uploadFile() {
    // console.log('uploading file', this.uploadFileForm.value.file);
    // console.log('uploading file', this.uploadFileForm.controls.file.value);

    // let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#imageUpload');

    const formData = new FormData();
    formData.append('file', this.uploadFileForm.value.file);
    // console.log(formData.get('image'));
    this.mediaManagerService.uploadFile(formData).subscribe(res => {
      this.getList();
    });
  }

  getList() {
    this.mediaManagerService.getList().subscribe(res => {
      this.filesList = res;
    });
  }
}