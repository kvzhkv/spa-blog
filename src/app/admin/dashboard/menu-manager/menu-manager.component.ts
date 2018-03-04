import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import { MenuManagerService } from './menu-manager.service';
import { NavbarService } from '../../../core/navbar/navbar.service';
import { BlogTitleService } from '../../../core/blog-title.service';


@Component({
  templateUrl: 'menu-manager.component.html',
  styleUrls: ['menu-manager.component.scss']
})

export class MenuManagerComponent implements OnInit {

  public editMenuForm: FormGroup;

  constructor(public menuManagerService: MenuManagerService,
    private fb: FormBuilder,
    public navbarService: NavbarService,
    public blogTitleService: BlogTitleService) { }

  ngOnInit() {
    this.blogTitleService.pushTitle('Menu Manager');
    this.editMenuForm = this.fb.group({
      menuItems: this.fb.array([])
    });
    this.getMenu();
  }

  getMenu(): void {
    this.menuManagerService.getMenu().subscribe(res => {
      if (res) {
        this.setMenuItems(res.menuItems);
      }
    });
  }

  setMenuItems(menuItems: any[]): void {
    const menu = menuItems.map((menuItem: any) => {
      return this.fb.group({
        tag: [{ value: menuItem.tag, disabled: false }, [Validators.required]],
        subtags: this.fb.array(menuItem.subtags)
      });
    });
    const tagsFormArray = this.fb.array(menu);
    this.editMenuForm.setControl('menuItems', tagsFormArray);
  }


  get menuItems(): FormArray {
    return this.editMenuForm.get('menuItems') as FormArray;
  }

  addTag(): void {
    this.menuItems.push(this.fb.group({
      tag: [{ value: '', disabled: false }, [Validators.required]],
      subtags: this.fb.array([])
    }));
  }

  removeTag(index: number): void {
    this.menuItems.removeAt(index);
  }

  removeSubtag(index: number, parentIndex: number): void {
    const subtags = <FormArray>this.menuItems.at(parentIndex).get('subtags');
    subtags.removeAt(index);
  }

  addSubtag(parentIndex: number) {
    const subtags = this.menuItems.controls[parentIndex].get('subtags') as FormArray;
    subtags.push(this.fb.control({ value: '', disabled: false }, [Validators.required]));
  }

  saveMenu() {
    this.menuManagerService.saveMenu(this.editMenuForm.value).subscribe(res => {
      if (res) {
        this.navbarService.getInfo();
      }
    });
  }
}
