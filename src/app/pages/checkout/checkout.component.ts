import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  loggedObj: any = {};
  cartItems: any[]= [];
  checkoutObj: any = {
    "SaleId": 0,
    "CustId": 0,
    "SaleDate": new Date(),
    "TotalInvoiceAmount": 0,
    "Discount": 0,
    "PaymentNaration": "",
    "DeliveryAddress1": "",
    "DeliveryAddress2": "",
    "DeliveryCity": "",
    "DeliveryPinCode": "",
    "DeliveryLandMark": ""
  }

  constructor(private productSrv: ProductService) {
    const localData = localStorage.getItem('amazon_user');
    if(localData != null) {
      const parseObj =  JSON.parse(localData);
      this.loggedObj = parseObj;
      this.getCartData(this.loggedObj.custId)
    }
  }

  ngOnInit(): void {
    
  }
  getCartData(id: number) {
    this.productSrv.getAddtocartdataByCust(id).subscribe((res: any)=>{
      this.cartItems = res.data;
    })
  }

  placeOrder() {
    this.checkoutObj.checkoutObj =  this.loggedObj.custId;
    this.productSrv.PlaceOrder(this.checkoutObj).subscribe((res: any)=> {
      if(res.result) { 
        this.productSrv.cartUpdated.next(true);
        alert("Order Has Been Succefully Placed")
      } else {
        alert(res.message)
      }
    })
  } 
}
