import { Component, OnInit } from '@angular/core';
import {HostListener, AfterViewInit,Inject } from '@angular/core';
import { ProductService } from 'app/services/product-service';
import { Observable } from 'rxjs';
import { Product } from 'app/models/product';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { PaginationInstance } from 'ngx-pagination';
import { WINDOW_PROVIDERS } from 'app/services/window.service';
import { DOCUMENT } from '@angular/platform-browser';
import { WINDOW } from "../services/window.service";
import { ProductDetailDialog } from 'app/product-detail-dialog/product-detail.dialog';
import { ProductDetail } from 'app/models/product-detail';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers : [ProductService,WINDOW_PROVIDERS]
})
export class HomeComponent {

  constructor(private productService : ProductService,
    private snackBar : MatSnackBar,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
    ){

  }

  productsFound : Product[];

  totalProducts : Product[];

  AllProductsFromAllSuppliers : Product[];

  myFilteredProducts : Product[];

  categories : String[];
  suppliers : String[];

  searchMode = false;

  selectedSuppliers : string[];
  selectedCategories : string[];

  showAllCats = false;

  BestSellers : Product[];
  NewProducts : Product[];
  RecommendedProducts : Product[];

  ScrollOffset = 247;

  ShowSideBarMobile = false;

  priceMax = 5000;
  priceMin = 1;

  passwordWrong = false;

  windowWidth: number = this.window.innerWidth;
  windowOffset : number = 0;
   //if screen size changes it'll update
   @HostListener('window:resize', ['$event'])
   resize(event) {
       this.windowWidth = window.innerWidth;
   }

   @HostListener("window:scroll", [])
   onWindowScroll() {
    this.windowOffset  = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

    if (this.windowOffset < this.ScrollOffset)
    {
      this.ShowSideBarMobile = false;
    }
     //console.log(this.windowOffset);
   }




   ngOnInit()
   {

      // if (sessionStorage.getItem("denbox_cached_products") != null)
      // {
      //    this.setProducts(<Product[]> (JSON.parse(sessionStorage.getItem("denbox_cached_products")))); 
      // }
      // else
      // {
          this.productService.getAll().toPromise().then(
            (data : Product[]) => {

              this.AllProductsFromAllSuppliers = data;
              this.setTotalProducts(data.filter(product => (product.supplier == "Dental Sky") && (product.description != null && product.description.trim().length) > 20));
              //sessionStorage.setItem("denbox_cached_products",JSON.stringify(data));
            },
            error =>
            {
              this.productService.getAll3().toPromise().then(
                (data2 : Product[]) => {
                  this.AllProductsFromAllSuppliers = data2;
                  this.setTotalProducts(data2.filter(product => (product.supplier == "Dental Sky") && (product.description != null && product.description.trim().length) > 20));
                  //sessionStorage.setItem("denbox_cached_products",JSON.stringify(data2));
                }
              )
            }
          );
      // }
   }




   ngAfterViewInit() {
    this.windowWidth = window.innerWidth;
  }


  setTotalProducts(products : Product[])
  {

    for (var i = 0 ; i < products.length; i++)
    {
      // var tmpProducts = this.AllProductsFromAllSuppliers.filter(p => p.mid == products[i].mid);
      // var min_price : number = tmpProducts[0].price ;
      // var max_price : number = tmpProducts[0].price ;

      // for (var j = 0 ; j < tmpProducts.length ; j++)
      // {
      //   if (Number(tmpProducts[j].price) < Number(min_price))
      //   {
      //     min_price = tmpProducts[j].price; 
      //   }

      //   if ( Number(tmpProducts[j].price) > Number(max_price))
      //   {
      //      max_price = tmpProducts[j].price; 
      //   }
      // }

      // products[i].minPrice = min_price;
      // products[i].maxPrice = max_price;

      products[i].minPrice = products[i].price;
      products[i].maxPrice = Number(products[i].price) + this.getRandomInt(2,Math.min(5,Math.floor(Number(products[i].price * 0.07))));
    
    }




    this.totalProducts = products;

    var index1 = this.getRandomInt(0, products.length - 4);
    this.BestSellers = products.slice(index1 , index1 + 3);

    var index2 = this.getRandomInt(0,products.length - 4);
    this.NewProducts = products.slice(index2, index2 + 3);

    var index3 = this.getRandomInt(0,products.length - 4);
    this.RecommendedProducts = products.slice(index3,index3 + 3);
  }


  loading = false;
  searchToken : string = '';
  callsCount = 0;
  gotIt = false;

  FindProducts2(search : string)
  {

    if (search == null || search.trim().length == 0)
    {
      this.setProducts(new Array<Product>());
      this.loading = false;
      this.searchToken = '';
      this.searchMode = false;
      return;
    }
    else
    {
      this.searchMode = true;
    }

    if (search.trim() == this.searchToken.trim())
    {
      return;
    }

    this.searchToken = search.trim().toLowerCase();
    
    if (search.trim().length > 0)
    {
      this.loading = true;

      var result = this.totalProducts.filter(product => (product.name != null && product.name.toLowerCase().indexOf(this.searchToken) >= 0) || (product.description != null && product.description.toLowerCase().indexOf(this.searchToken) >= 0));

      for (var i=0; i < result.length; i++)
      {
        result[i].sortRating = 0;
        if (result[i].name.toLowerCase().indexOf(this.searchToken) >= 0)
        {
          result[i].sortRating += 5;
        }

        if (result[i].description.toLowerCase().indexOf(this.searchToken) >= 0)
        {
          result[i].sortRating += 1;
        }

      }



      result = result.sort((a, b) => {
        if (Number(a.sortRating) < Number(b.sortRating)) return 1;
        else if (Number(a.sortRating)> Number(b.sortRating)) return -1;
        else return 0;
      });

      this.setProducts(result);

      this.loading = false;
    }
  }

   FindProducts(search : string)
  {
    if (search == null || search.trim().length == 0)
    {
      this.setProducts(new Array<Product>());
      this.loading = false;
      this.searchToken = '';
      this.searchMode = false;
      return;
    }
    else
    {
      this.searchMode = true;
    }

    if (search.trim() == this.searchToken.trim())
    {
      return;
    }

    this.searchToken = search.trim();
    
    if (search.trim().length > 0)
    {
      this.loading = true;
      this.setProducts(new Array<Product>());
     
      this.callsCount++;

      this.gotIt = false;

      this.productService.findProducts2(search.trim()).toPromise().then(
        data => {
          this.callsCount--;
          if (this.callsCount <= 0)
          {
            this.loading = false;
          }
          if (this.productsFound == null)
          {
            this.productsFound = new Array<Product>();
          }
          if (data.length > 1)
          {
            if (data[0].searchString == this.searchToken && !this.gotIt)
            {
                // this.snackBar.open("Winner : " , "2",{
                //       duration : 1000
                //     });
              this.gotIt = true;
              this.setProducts(data);
              this.loading = false;
            }
          }
          else if (data.length == 1)
          {
              if (data[0].searchString == this.searchToken && !this.gotIt)
              {
                this.gotIt = true;
                this.loading = false;
                if (data[0].name === 'No Records')
                {
                  if (this.productsFound == null)
                  {
                    this.setProducts(new Array<Product>());
                  }
                }
                else
                {
                    this.setProducts(data);
                }
              }
            }
        }
        ,error =>
        {
          this.callsCount--;
          if (this.callsCount <= 0)
          {
            this.loading = false;
          }
          // this.snackBar.open("Sorry, could not connect to the server!" , "Error",{
          //   duration : 500
          // });
          this.loading = false;
        }
      );


      this.callsCount++;
      this.productService.findProducts(search.trim()).toPromise().then(
        data => {
          this.callsCount--;
          if (this.callsCount <= 0)
          {
            this.loading = false;
          }
          if (this.productsFound == null)
          {
            this.setProducts(new Array<Product>());
          }
          if (data.length > 1)
          {
            if (data[0].searchString == this.searchToken && !this.gotIt)
            {
              // this.snackBar.open("Winner : " , "1",{
              //   duration : 1000
              // });

              this.gotIt = true;
              this.setProducts(data);
              this.loading = false;
            }
          }
          else if (data.length == 1)
          {
              if (data[0].searchString == this.searchToken && !this.gotIt)
              {
                this.gotIt = true;
                this.loading = false;
                if (data[0].name === 'No Records')
                {
                  if (this.productsFound == null)
                  {
                    this.setProducts(new Array<Product>());
                  }
                }
                else
                {
                    this.setProducts(data);
                }
              }
            }
        }
        ,error =>
        {
          this.callsCount--;
          if (this.callsCount <= 0)
          {
            this.loading = false;
          }
          // this.snackBar.open("Sorry, could not connect to the server!" , "Error",{
          //   duration : 500
          // });
          this.loading = false;
        }
      );





      //  this.productService.findProducts2(search.trim()).subscribe(
      //   (data : Product[] )=>
      //   {
      //     this.callsCount--;
      //     if (this.callsCount <= 0)
      //     {
      //       this.loading = false;
      //     }
      //     if (this.productsFound == null)
      //     {
      //       this.productsFound = new Array<Product>();
      //     }
      //     if (data.length > 0)
      //     {
      //       if (data[0].searchString == this.searchToken)
      //       {
      //         this.productsFound = data;
      //         this.loading = false;
      //       }
      //     }
          
      //   },
      //   error => {
      //     this.callsCount--;
      //     if (this.callsCount <= 0)
      //     {
      //       this.loading = false;
      //     }
      //     this.snackBar.open("Sorry, could not connect to the server!" , "Error",{
      //       duration : 500
      //     });
      //     this.loading = false;
      //   }
      // );
    }
  }

  setProducts(products : Product[])
  {
    this.productsFound = products;
    this.myFilteredProducts = products;
    this.extractCats(products);
    this.extractSuppliers(products);
    this.page = 1;
    this.showAllCats = false;
  }

  extractCats(products : Product[])
  {
    this.categories = new Array<string>();
    this.selectedCategories = new Array<string>(); 
    for (var i=0;i<products.length;i++)
    {
      if (products[i].category != null)
      {
        if (this.categories.indexOf(products[i].category.trim()) < 0)
        {
          this.categories.push(products[i].category);
        }
      }
    }
  }

  extractSuppliers(products : Product[])
  {
    this.suppliers = new Array<string>();
    this.selectedSuppliers = new Array<string>(); 
    for (var i=0;i<products.length;i++)
    {
      if (this.suppliers.indexOf(products[i].supplier.trim()) < 0)
      {
        this.suppliers.push(products[i].supplier);
      }
    }
  }



  onCategoriesChange(cat,event)
  {
    if (event.checked)
    {
      if (this.selectedCategories != null && this.selectedCategories.indexOf(cat.trim()) < 0)
      {
        this.selectedCategories.push(cat.trim());
      }
    }
    else
    {
      let index =  this.selectedCategories != null ? this.selectedCategories.indexOf(cat.trim()) : -1;
      if ( index >= 0)
      {
        this.selectedCategories.splice(index,1);
      }
    }

    this.updateFilteredProducts();
  }

  onSuppliersChange(sup,event)
  {
    if (event.checked)
    {
      if (this.selectedSuppliers != null && this.selectedSuppliers.indexOf(sup.trim()) < 0)
      {
        this.selectedSuppliers.push(sup.trim());
      }
    }
    else
    {
      let index =  this.selectedSuppliers != null ? this.selectedSuppliers.indexOf(sup.trim()) : -1;
      if ( index >= 0)
      {
        this.selectedSuppliers.splice(index,1);
      }
    }

    this.updateFilteredProducts();
  }


  filteredProducts(products : Product[])
  {
    var filtered = products;
    if (this.selectedCategories != null && this.selectedCategories.length > 0)
    {
      filtered = products.filter(product => this.selectedCategories.indexOf(product.category.trim()) >= 0);
    }

    if (this.selectedSuppliers != null && this.selectedSuppliers.length > 0)
    {
      filtered = filtered.filter(product => this.selectedSuppliers.indexOf(product.supplier.trim()) >= 0);
    }

    if (this.PriceChanged())
    {
      filtered = filtered.filter(product => product.price >= this.priceMin && product.price <= this.priceMax);
    }

    return filtered;
  }

  resetCategoryFilter()
  {
    this.selectedCategories = new Array<string>();
    this.updateFilteredProducts();
  }

  resetSupplierFilter()
  {
    this.selectedSuppliers = new Array<string>();
    this.updateFilteredProducts();
  }

  resetPriceFilter()
  {
    this.priceMax = 5000;
    this.priceMin = 1;
    this.updateFilteredProducts();
  }

  catChecked(cat)
  {
    if (this.selectedCategories != null && this.selectedCategories.length > 0)
    {
      return (this.selectedCategories.indexOf(cat.trim()) >= 0);
    }
    return false;
  }

  supChecked(sup)
  {
    if (this.selectedSuppliers != null && this.selectedSuppliers.length > 0)
    {
      return (this.selectedSuppliers.indexOf(sup.trim()) >= 0);
    }
    return false;
  }

  PriceMaxChanged(event)
  {
    if (this.priceMax != event.value)
    {
      this.priceMax = event.value;
      this.updateFilteredProducts();
    }
  }

  PriceMinChanged(event)
  {
    if (this.priceMin != event.value)
    {
      this.priceMin = event.value;
      this.updateFilteredProducts();
    }
  }

  PriceChanged() : boolean
  {
    return  (this.priceMax != 5000) || (this.priceMin != 1);
  }

  prevScrollOffset;
  FilterCountChanged = false;
  updateFilteredProducts()
  {
    let prevCount = this.myFilteredProducts.length;
    this.myFilteredProducts = this.filteredProducts(this.productsFound);
    let curCount = this.myFilteredProducts.length;

    this.FilterCountChanged = (prevCount !== curCount);

    setTimeout(() => {
      this.FilterCountChanged = false;
    },2000);

    this.page = 1;

    this.prevScrollOffset = this.windowOffset;

      if (this.FilterCountChanged)
      {
          setTimeout(() => {   
            var curOffset =  this.windowOffset;
            if ( Math.abs(curOffset - this.prevScrollOffset) < 10 && (curOffset > this.ScrollOffset))
            {
                this.ScrollToNav();
            }
          }, 2000); 
     }
  }

  HasFilters() : boolean
  {
    return (this.selectedCategories != null && this.selectedCategories.length > 0)
        || (this.selectedSuppliers != null && this.selectedSuppliers.length > 0)
        || this.PriceChanged();
  }


  PageSize = 20;
  page : number = 1;

  getPage(pageIndex : number) : Product[]
  {
    var start = (pageIndex - 1) * this.PageSize;
    var end = start + this.PageSize;

    if (end >= this.myFilteredProducts.length)
    {
      end = this.myFilteredProducts.length - 1;
    }

    if (start >= this.myFilteredProducts.length)
    {
      return null;
    }

    return this.myFilteredProducts.slice(start,end);
  }

  ScrollToTop()
  {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

  OnMobile() : boolean
  {
    return (this.windowWidth <= 780);
  }

  ScrollToNav()
  {
    if (this.windowWidth <= 780)
    {
      this.ScrollToNavMobile();
      return;
    }
    window.scrollTo({ left: 0, top: this.ScrollOffset, behavior: 'smooth' });
  }

  ScrollToNavMobile()
  {
    window.scrollTo({ left: 0, top: this.ScrollOffset, behavior: 'smooth' });
  }

  fabFilterClick()
  {
    if (!this.ShowSideBarMobile) 
    {
      this.ScrollToNavMobile();
      setTimeout(() => {
        this.ShowSideBarMobile = !this.ShowSideBarMobile;
       }, 500); 
    }
    else
    {
      this.ShowSideBarMobile = !this.ShowSideBarMobile;
    }

  }

  ViewAllPrices(product : Product)
  {

    var productDetail = new ProductDetail();

    productDetail.mobile = this.OnMobile();

    productDetail.products = new Array<Product>();

    productDetail.products.push(product);
    

    

    var p2 = <Product>JSON.parse(JSON.stringify(product));
    p2.supplier = "Try Care";
    p2.price = this.getRandomInt(Number(product.price) , Number(product.maxPrice));  //Number(product.price) + this.getRandomInt(1,Math.min(5,Math.floor(Number(product.price) * 0.05)));

    
    var p3 = <Product>JSON.parse(JSON.stringify(product));
    p3.supplier = "Swallow Dental";
    p3.price = product.maxPrice;  //Number(product.price) + this.getRandomInt(1,Math.min(5,Math.floor(Number(product.price * 0.07))));

    productDetail.products.push(p2);
    productDetail.products.push(p3);


    productDetail.products = productDetail.products.sort((a, b) => {
      if (Number(a.price) < Number(b.price)) return -1;
      else if (Number(a.price)> Number(b.price)) return 1;
      else return 0;
    });

    // productDetail.products = this.AllProductsFromAllSuppliers.filter(p => p.mid === product.mid).sort((a, b) => {
    //   if (Number(a.price) < Number(b.price)) return -1;
    //   else if (Number(a.price)> Number(b.price)) return 1;
    //   else return 0;
    // });

    // for (var i=0; i< productDetail.products.length ; i++)
    // {
    //   if (productDetail.products[i].supplier == "Try Care")
    //   {
    //     productDetail.products[i].supplier = "Dental Sky";
    //   }
    //   else if (productDetail.products[i].supplier == "Dental Sky")
    //   {
    //     productDetail.products[i].supplier = "Try Care";
    //   }
    // }



    const dialogConfig = new MatDialogConfig();

    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;    
    dialogConfig.panelClass = "custom-modalbox";    
    dialogConfig.minWidth = "90%";
    dialogConfig.minHeight = "90%";
    dialogConfig.data = productDetail;  
    dialogConfig.disableClose = false;

    const dialogRef = this.dialog.open(ProductDetailDialog,dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => {
          if (val)
          {

          }
      }
  );


  }

  EnterSite(password)
  {
    if (password != null && password == 'denBox$123')
    {
      this.passwordWrong = false;
      sessionStorage.setItem("denbox-user", "guest");
    }
    else
    {
      this.passwordWrong = true;
    }
  }

  CheckEnter(event,password)
  {
    if (event.keyCode == 13)
    {
      this.EnterSite(password);
    }
    else
    {
      this.passwordWrong = false;
    }
  }
  

  highlight(content : string, search : string)
  {
    // return content.replace(new RegExp(search, "gi"), match => {
    //   return '<span style="background: yellow;">' + match + '</span>'});

    return content.replace(new RegExp(search, "gi"), match => {
      return '<mark>' + match + '</mark>'});
  }


  getRandomInt(min : number, max : number) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


  getUserName() : string
  {
    return sessionStorage.getItem("denbox-user");
  }

}