class CustomerList {
  constructor() {
    this.list = [];
    let id = localStorage.getItem("CurrentId");
    if (id != null) {
      this.customer_id = id;
    } else {
      this.customer_id = 1;
    }
  }
  displayCustomer() {
    const customerList = this.getContactsFromLocalStorage();
    this.addCustomerToList(customerList);
    if (customerList.length == 0) {
      this.setDummyCustomer();
    }
  }
  setDummyCustomer() {
    //dummy customer
    for (let customerinfo of dummyContacts) {
      let customer = new Customer(
        customerinfo.name.first,
        customerinfo.name.last,
        customerinfo.Contractend.date,
        customerinfo.phone,
        customerinfo.picture.large,
        customerinfo.email,
        this.customer_id,
        customerinfo.location,
        customerinfo.company.name
      );
      this.saveContactToLocalStorage(customer);
    }
  }

  getContactsFromLocalStorage() {
    if (localStorage.getItem("Customers") === null) {
      this.list = [];
    } else {
      this.list = JSON.parse(localStorage.getItem("Customers"));
    }
    return this.list;
  }
  saveContactToLocalStorage(contact) {
    const customerList = this.getContactsFromLocalStorage();
    this.list.push(contact);
    this.customer_id++;
    localStorage.setItem("Customers", JSON.stringify(customerList));
    localStorage.setItem("CurrentId", this.customer_id);
  }

  RemoveContactFromLocalStorage(id) {
    const customerList = this.getContactsFromLocalStorage();
    if (id.classList.contains("delete")) {
      customerList.forEach((contact, index) => {
        let remID = id.getAttribute("data-id");
        if (contact.id == remID) {
          customerList.splice(index, 1);
        }
      });
    }
    localStorage.setItem("Customers", JSON.stringify(customerList));
  }
  //Append table row
  addCustomerToList(list) {
    const cusDiv = document.querySelector("#myTable");
    let dataHtml = "";
    for (let customer of list) {
      dataHtml += `<tr><td>${customer.id}</td>
                <td><img src="${customer.photo}" class="img-fluid rounded-circle" width="30%"/></td>
                <td>${customer.name}</td>
                <td>${customer.lastname}</td>
                <td><a href="#" >${customer.email} </a></td>
                <td>${customer.tel}</td>
                <td>${customer.company}</td>
                <td><a href="#" class="btn btn-success btn-sm info" id=infoBtn${customer.id} data-id=${customer.id}>Info</a></td>
                <td class="text-center"><button class="btn btn-danger btn-sm delete" id="deleteBtn${customer.id}" data-id=${customer.id}>X</button></td></tr>
                `;
      cusDiv.innerHTML = dataHtml;
    }
    let deleteBtn = document.getElementsByClassName('delete');
    let infoBtn = document.getElementsByClassName('info');
    let self = this;
    //Delete customer from UI and localStorage
    for (let i = 0; i < deleteBtn.length; i++) {
      deleteBtn[i].addEventListener('click', function (e) {
        self.handleDeleteClicked(e);
      });
      //Show customer Info
      infoBtn[i].addEventListener('click', function (e) {
        self.handleInfoClicked(e);
      });
    }
  }
  addNewContact() {
    const name = document.querySelector("#inputName").value;
    const lastname = document.querySelector("#inputLastname").value;
    const email = document.querySelector("#inputEmail").value;
    const tel = document.querySelector("#inputTel").value;
    const company = document.querySelector("#inputCompany").value;
    const address = document.querySelector("#inputAddress").value;

    //I framtiden om vi vet hur man spara photo så behöver vi inte dummy data
    let photo = [
      "https://randomuser.me/api/portraits/women/5.jpg",
      "https://randomuser.me/api/portraits/men/15.jpg",
      "https://randomuser.me/api/portraits/women/78.jpg",
      "https://randomuser.me/api/portraits/women/30.jpg",
      "https://randomuser.me/api/portraits/women/71.jpg",
      "https://randomuser.me/api/portraits/men/0.jpg",
      "https://randomuser.me/api/portraits/men/67.jpg",
      "https://randomuser.me/api/portraits/women/89.jpg",
      "https://randomuser.me/api/portraits/women/9.jpg",
      "https://randomuser.me/api/portraits/men/9.jpg"
    ];
    let randomPhoto = photo[Math.floor(Math.random() * photo.length)];

    let contractEndDate = ["2019-11-12", "2019-12-20", "2019-11-05","2020-01-04","2019-12-23","2019-11-13"];
    let randomContractEndDate = contractEndDate[Math.floor(Math.random() * contractEndDate.length)];

    let newCus = new Customer(name, lastname, randomContractEndDate, tel, randomPhoto, email, this.customer_id, address, company);
    this.list.push(newCus);
    this.saveContactToLocalStorage(newCus);
    this.clearFieldInput();
  }
  //delete from UI
  deleteContactList(e) {
    if (e.classList.contains("delete")) {
      e.parentElement.parentElement.remove();
    }
  }
  //Show customer info here
  showInfo(id) {
    if (id.classList.contains("info")) {
      let customerId = id.getAttribute("data-id");
      this.list.forEach(contact => {
        if (contact.id == customerId) {
          document.querySelector("#cusName").innerHTML = contact.name + ' ' + contact.lastname;
          document.querySelector("#phoneNum").innerHTML = contact.tel;
          document.querySelector("#email").innerHTML = contact.email;
          document.querySelector("#companyName").innerHTML = contact.company;
          document.querySelector("#profile_user_pic").src = contact.photo;
          document.querySelector("#address").innerHTML = contact.address;
          document.querySelector("#DOB").innerHTML = contact.contract;
        }
      });
    }
  }
  addCallToCustomer(id) {
    const customerList = this.getContactsFromLocalStorage();
    const appendCall = document.querySelector("#callLog");
    const getDate = document.querySelector("#dateInput").value;
    const callDetails = document.querySelector("#callDetails").value;
    for (let i = 0; i < customerList.length; i++) {
      if (customerList[i].id == id) {
        let newCall = new call(getDate, callDetails);
        customerList[i].call.push(newCall);
        localStorage.setItem("Customers", JSON.stringify(customerList));
        this.renderCall(id);
      }
    }
  }
  renderCall(id) {
    const customerList = this.getContactsFromLocalStorage();
    const appendCall = document.querySelector("#callLog");
    for (let i = 0; i < customerList.length; i++) {
      if (customerList[i].id == id) {
        let addCallHtml = "";
        for (let call of customerList[i].call) {
          addCallHtml += `<div class="card mb-2"><div class="py-1 card-header">${call.date}</div><div class="py-1 card-body">${call.details}</div></div>`;
        }
        appendCall.innerHTML = addCallHtml;
      }
    }
  }

  addNoteToCustomer(id) {
    const customerList = this.getContactsFromLocalStorage();
    const customerNote = document.querySelector("#addNote").value;

    for (let i = 0; i < customerList.length; i++) {
      if (customerList[i].id == id) {
        customerList[i].note.push(customerNote);
        localStorage.setItem("Customers", JSON.stringify(customerList));
        this.renderNote(id);
      }
    }
  }
  renderNote(id) {
    const customerList = this.getContactsFromLocalStorage();
    const appendNote = document.querySelector("#note");
    for (let i = 0; i < customerList.length; i++) {
      if (customerList[i].id == id) {
        let addNoteHtml = "";
        for (let note of customerList[i].note) {
          addNoteHtml += `<p>${note}</p>`;
        }
        appendNote.innerHTML = addNoteHtml;
      }
    }
  }
  // search by name
  filterNames() {
    let filterValue = document.getElementById("search").value.toUpperCase();
    let names = document.getElementById("myTable");
    let tr = names.querySelectorAll("tr");
    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td")[2];
      if (td.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }

  validateCustomer() {
    const name = document.querySelector("#inputName").value;
    if (name == "") {
      document.querySelector("#invalidName").innerHTML =
        "Please write customer name";
      return false;
    }
    const lastname = document.querySelector("#inputLastname").value;
    if (lastname == "") {
      document.querySelector("#invalidLastname").innerHTML =
        "Please write customer lastname";
      return false;
    }
    const email = document.querySelector("#inputEmail").value;
    if (email == "") {
      document.querySelector("#invalidEmail").innerHTML =
        "Please write customer email";
      return false;
    }
    const tel = document.querySelector("#inputTel").value;
    if (tel == "") {
      document.querySelector("#invalidTel").innerHTML =
        "Please write customer telephone number";
      return false;
    }
    if (isNaN(tel)) {
      document.querySelector("#invalidTel").innerHTML =
        "Please write telephone number in digits";
      return false;
    }
    const company = document.querySelector("#inputCompany").value;
    if (company == "") {
      document.querySelector("#invalidCompany").innerHTML =
        "Please write customer company";
      return false;
    } else return true;
  }
  clearFieldInput() {
    document.querySelector("#inputName").value = "";
    document.querySelector("#inputLastname").value = "";
    document.querySelector("#inputEmail").value = "";
    document.querySelector("#inputTel").value = "";
    document.querySelector("#inputCompany").value = "";
    document.querySelector("#inputAddress").value = "";
    document.querySelector("#invalidName").value = "";
    document.querySelector("#invalidLastname").value = "";
    document.querySelector("#invalidEmail").value = "";
    document.querySelector("#invalidTel").value = "";
    document.querySelector("#invalidCompany").value = "";
  }
  handleInfoClicked(e) {
    let id = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    this.showInfo(e.target);
    this.renderNote(id);
    this.renderCall(id);
    document.querySelector('#showInfoDiv').classList.remove("hide");
    document.querySelector('#tableDiv').classList.add("hide");
    document.getElementById('addContactbtn').classList.add('hide')
    let self = this;
    //Add Note to customer
    document.getElementById('addNoteBtn').addEventListener('click', function (e) {
      self.addNoteToCustomer(id);
    });
    //Add Calling list to customer
    document.getElementById('addCalltbtn').addEventListener('click', function (e) {
      $('#addCall').modal('show');
      document.getElementById('saveLastCall').addEventListener('click', function (e) {
        self.addCallToCustomer(id);
      });
    });
  }
  handleDeleteClicked(e) {
    this.deleteContactList(e.target);
    this.RemoveContactFromLocalStorage(e.target);
  }
}
class call {
  constructor(date, details) {
    this.date = date;
    this.details = details;
  }
}

class Customer {
  constructor(name, lastname, contract, tel, photo = "", email, id, address = "", company) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.tel = tel;
    this.photo = photo;
    this.email = email;
    this.address = address;
    this.company = company;
    this.note = [];
    this.call = [];
    this.contract = contract;
  }
}


