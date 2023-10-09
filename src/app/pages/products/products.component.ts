import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{

  productsArray: any[] = [];
  categories: any[]= [];
  selectedCategory: number = 0;
  loggedObj: any = {};

  constructor(private productSrv: ProductService) {
    const localData = localStorage.getItem('amazon_user');
    if(localData != null) {
      const parseObj =  JSON.parse(localData);
      this.loggedObj = parseObj;
    }
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategory();
  }
  loadProducts() {
    this.productSrv.getAllProducts().subscribe((Res: any) =>{
      this.productsArray = Res.data;
    })
  }

  getAllProductsByCateogry(categoryId: number) {
    this.selectedCategory = categoryId;
    this.productSrv.getAllProductsByCateogry(categoryId).subscribe((Res: any) =>{
      this.productsArray = Res.data;
    })
  }
  

  loadCategory() {
    this.productSrv.getAllCategory().subscribe((Res: any) =>{
      this.categories = Res.data;
    })
  }

  addtocart(producId: number) {
    if(this.loggedObj.custId == undefined) {
      this.productSrv.showLogin.next(true);
    } else {
      const obj = {
        "CartId": 0,
        "CustId": this.loggedObj.custId,
        "ProductId": producId,
        "Quantity": 1,
        "AddedDate": new Date()
      }
      this.productSrv.addtoCart(obj).subscribe((res: any)=> {
        if(res.result) {
          alert("Product Added to Cart"); 
          this.productSrv.cartUpdated.next(true);
        } else {
          alert(res.message)
        }
      }) 
    }
    debugger;
    
  }




}
