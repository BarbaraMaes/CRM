window.addEventListener('DOMContentLoaded', (event) => {

    const showDiv = document.querySelector('#showInfoDiv');
    const tableDIv = document.querySelector('#tableDiv');
    const deleteBtn = document.getElementsByClassName('delete');
    const infoBtn = document.getElementsByClassName('info');
    const saveBtn = document.getElementById('saveBtn');
    const noteBtn = document.getElementById('addNoteBtn');
    const callBtn = document.getElementById('addCalltbtn');
    const filterInput = document.getElementById('search');
    const logoutBtn = document.querySelector('#logout');


    let customerList = new CustomerList();
    customerList.displayCustomer();

    logoutBtn.addEventListener('click',function(){
        localStorage.removeItem('alerted');
    });

    saveBtn.addEventListener('click', function () {
        let validateInput = customerList.validateCustomer();
        if (validateInput == true) {
            customerList.addNewContact();
            $('#addContact').modal('hide');
            customerList.displayCustomer();
        }
    });
    //Delete customer from UI and localStorage
    for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener('click', function (e) {
            console.log(e.target);
            customerList.deleteContactList(e.target);
            customerList.RemoveContactFromLocalStorage(e.target);
        });
        //Show customer Info
        infoBtn[i].addEventListener('click', function (e) {
            let id = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            console.log("id " + id);
            customerList.showInfo(e.target);
            customerList.renderNote(id);
            customerList.renderCall(id);
            showDiv.classList.remove("hide");
            tableDIv.classList.add("hide");
            //Add Note to customer
            noteBtn.addEventListener('click', function (e) {
                customerList.addNoteToCustomer(id);
            });
            //Add Calling list to customer
            callBtn.addEventListener('click', function (e) {
                const saveBtn = document.querySelector('#saveLastCall');
                $('#addCall').modal('show');
                saveBtn.addEventListener('click', function (e) {
                    customerList.addCallToCustomer(id);
                });
            });
        });
    }
    // search by name
    filterInput.addEventListener('keyup', customerList.filterNames);
    $(".menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

});