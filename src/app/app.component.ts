import { Component } from '@angular/core';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'amazom_eCommerce';
  registerObj: any = {
    "CustId": 0,
    "Name": "",
    "MobileNo": "",
    "Password": ""
  }
  loginObj: any = {
    "UserName": "",
    "UserPassword": ""
  }
  loggedObj: any = {};
  cartItems: any[]= [];

  constructor(private productSrv: ProductService) {
    const localData = localStorage.getItem('amazon_user');
    if(localData != null) {
      const parseObj =  JSON.parse(localData);
      this.loggedObj = parseObj;
      this.getCartData(this.loggedObj.custId)
    }
    this.productSrv.cartUpdated.subscribe((res: boolean)=>{
      if(res) {
        this.getCartData(this.loggedObj.custId)
      }
    })
  }

  getCartData(id: number) {
    this.productSrv.getAddtocartdataByCust(id).subscribe((res: any)=>{
      this.cartItems = res.data;
    })
  }

  onRegister() {
    this.productSrv.register(this.registerObj).subscribe((res: any)=> {
      if(res.result) {
        this.loggedObj = res.data;
        alert("User Creation Done")
      } else {
        alert(res.message)
      }
    })
  }
  onLogin() {
    this.productSrv.login(this.loginObj).subscribe((res: any)=> {
      if(res.result) {
        alert("User Login Success");
        this.loggedObj = res.data;
        localStorage.setItem('amazon_user', JSON.stringify(res.data));
        this.getCartData(this.loggedObj.custId)
      } else {
        alert(res.message)
      }
    })
  }
  removeItem(cartId: number) {
    this.productSrv.removeProductFromCart(cartId).subscribe((res: any)=> {
      if(res.result) {
        alert("Item Removed"); 
        this.getCartData(this.loggedObj.custId)
      } else {
        alert(res.message)
      }
    })
  }
  
}
