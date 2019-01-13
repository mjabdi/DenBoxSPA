import { Component,Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Product } from "app/models/product";
import { ProductDetail } from "app/models/product-detail";
 
@Component({
    selector: 'product-detail-dialog',
    templateUrl: './product-detail-dialog.html',
    styleUrls: ['./product-detail-dialog.scss']
})

export class ProductDetailDialog implements OnInit {

  detailInfo : ProductDetail ;

  constructor(
    private dialogRef: MatDialogRef<ProductDetailDialog>,
    @Inject(MAT_DIALOG_DATA) data ) 
   {
        this.detailInfo = data;
   }

  ngOnInit() { 

  }


  closeDialog()
  {
      this.dialogRef.close();
  }

  getSupImage(sup)
  {
    if (sup == 'Try Care') return  "https://www.trycare.co.uk/images/ww/page/Dental%20Icon.jpg";
    else if (sup == 'Swallow Dental') return  "https://www.swallowdental.co.uk/media/favicon/default/favicon.ico";
    else if (sup == 'Dental Sky') return  "https://cdn.dentalsky.com/skin/frontend/dental/default/images/dental_sky_new_logo.svg";
    else return '';
  }
  
  getSupImageClass(sup)
  {
    if (sup == 'Try Care') return  "supplier-image-trycare";
    else if (sup == 'Swallow Dental') return  "supplier-image-swallowdental";
    else if (sup == 'Dental Sky') return  "supplier-image-dentalsky";
    else return '';
  }

  getSupImageClassMobile(sup)
  {
    if (sup == 'Try Care') return  "supplier-image-trycare-mobile";
    else if (sup == 'Swallow Dental') return  "supplier-image-swallowdental-mobile";
    else if (sup == 'Dental Sky') return  "supplier-image-dentalsky-mobile";
    else return '';
  }


}