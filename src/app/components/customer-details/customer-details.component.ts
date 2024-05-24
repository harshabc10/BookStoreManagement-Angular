import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book-service/book.service';
import { DataService } from 'src/app/services/data-service/data.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {

  customerForm: FormGroup;
  showAddressForm: boolean = false;
  typeDisplayMap: { [key: string]: string } = {
    '1': 'Home',
    '2': 'Work',
    '3': 'Other'
  };
  addresses: any[] = []; // Initialize addresses as an empty array
  
  addressId: number | undefined; // Updated to allow undefined initially

  @Output() addressSelected = new EventEmitter<number>();

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private dataService: DataService,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      userName: ['', Validators.required],
      userPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      type: ['', Validators.required]
    });
  }
flag:boolean=false;
  ngOnInit(): void {
    if (localStorage.getItem('authToken') != null) {
      this.bookService.getAllAddress().subscribe(
        (response: any) => {
          if (response && response.data && response.data.length > 0) {
            console.log('Fetched Address Data:', response.data);
            this.addresses = response.data;
            this.addressId = response.data[0].addressId; // Assuming addressId is available in the response
            this.populateForm(response.data);
            this.emitAddressId(this.addressId);  // Emit the addressId obtained
          } else {
            console.error('Invalid or empty data received:', response);
          }
        },
        (error) => {
          console.error('Error fetching addresses:', error);
        }
      );
    } else {
      console.log('User not authenticated');
    }
    this.fetchAddresses();
  }

  fetchAddresses(): void {
    if (localStorage.getItem('authToken') != null) {
      this.bookService.getAllAddress().subscribe(
        (response: any) => {
          if (response && response.data && response.data.length > 0) {
            this.addresses = response.data;
            this.addressId = response.data[0].addressId;
            this.populateForm(response.data);
            this.emitAddressId(this.addressId);
          } else {
            console.error('Invalid or empty data received:', response);
          }
        },
        (error) => {
          console.error('Error fetching addresses:', error);
        }
      );
    } else {
      console.log('User not authenticated');
    }
  }
  onContinueb()
  {
    
    if (this.addressId) { // Check if addressId is available
      
      const authToken = localStorage.getItem('authToken');
      const updatedAddressData = this.customerForm.value;

      if (authToken !== null) {
        this.bookService.editAddress(this.addressId, updatedAddressData, authToken).subscribe(
          (response) => {
            console.log('Address updated successfully:', response);
          },
          (error) => {
            console.error('Error updating address:', error);
          }
        );
      } else {
        console.log('Auth token is null. Cannot edit address.');
      }
    } else {
      this.bookService.addAddressService(this.customerForm.value).subscribe(res=>{
        
        console.log(res)
      }
      )
    }
  }

  onContinue(add: any): void {
  //   if (add.AddressId) { // Check if addressId is available
  //     this.addressId=add.AddressId;
  //     const authToken = localStorage.getItem('authToken');
  //     const updatedAddressData = this.customerForm.value;

  //     if (authToken !== null) {
  //       this.bookService.editAddress(add.AddressId, updatedAddressData, authToken).subscribe(
  //         (response) => {
  //           console.log('Address updated successfully:', response);
  //         },
  //         (error) => {
  //           console.error('Error updating address:', error);
  //         }
  //       );
  //     } else {
  //       console.log('Auth token is null. Cannot edit address.');
  //     }
  //   } else {
  //     console.log('Address ID not available. Cannot edit address.');
  //   }
  this.emitAddressId(add.AddressId);
  }
  
  toggleAddressForm(): void {
    this.showAddressForm = true; // Show the address form
this.flag=true;
    this.customerForm.reset(); // Reset the form to empty values
  }

  populateForm(data: any): void {
    if (data ) {
      const firstAddress = data;
      this.customerForm.patchValue({
        userName: firstAddress.UserName || '',
        userPhone: firstAddress.UserPhone || '',
        address: firstAddress.Address || '',
        city: firstAddress.City || '',
        state: firstAddress.State || '',
        type: firstAddress.Type || ''
      });
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      console.log('Form Submitted!', this.customerForm.value);
    } else {
      console.log('Form not valid');
    }
  }

  getTypeDisplayValue(): string {
    const typeControl = this.customerForm.get('type');
    if (typeControl && typeControl.value !== null && this.typeDisplayMap.hasOwnProperty(typeControl.value)) {
      return this.typeDisplayMap[typeControl.value];
    }
    return '';
  }

  updateTypeValue(value: string): void {
    this.customerForm.patchValue({ type: value });
  }

  home(): void {
    this.router.navigate(['/dashboard/books']);
  }
  editAddress(add: any): void {
    this.addressId=add.AddressId
    this.showAddressForm = true; // Open the form fields
    this.populateForm(add); // Populate the form with the address details
  }

  // editAddress(): void {
  //   if (this.addressId) { // Check if addressId is available
  //     const authToken = localStorage.getItem('authToken');
  //     const updatedAddressData = this.customerForm.value;

  //     if (authToken !== null) {
  //       this.bookService.editAddress(this.addressId, updatedAddressData, authToken).subscribe(
  //         (response) => {
  //           console.log('Address updated successfully:', response);
  //         },
  //         (error) => {
  //           console.error('Error updating address:', error);
  //         }
  //       );
  //     } else {
  //       console.log('Auth token is null. Cannot edit address.');
  //     }
  //   } else {
  //     console.log('Address ID not available. Cannot edit address.');
  //   }
  // }

  deleteAddress(add: any): void {
    const addressId = add.AddressId;
    const authToken = localStorage.getItem('authToken');
    if (authToken !== null && authToken !== undefined) {
      this.bookService.deleteAddress(addressId, authToken).subscribe(
        (response) => {
          console.log('Address deleted successfully:', response);
          // Update the addresses array by filtering out the deleted address
          this.addresses = this.addresses.filter(address => address.AddressId !== addressId);
        },
        (error) => {
          console.error('Error deleting address:', error);
        }
      );
    } else {
      console.log('Auth token is null or undefined. Cannot delete address.');
    }
  }
  
  

  emitAddressId(addressId: number | undefined): void {
    if (addressId != undefined) {
      this.addressSelected.emit(addressId);
    } else {
      console.error('Invalid addressId:', addressId);
    }
  }
  
}
