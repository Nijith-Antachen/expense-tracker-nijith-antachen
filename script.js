let startButton = document.getElementById("startButton");
let home = document.getElementById("home");
let tracker = document.getElementById("tracker");

let button = document.getElementById("Button");
let output =document.getElementById("output");
let fOutput =document.getElementById("fOutput");

let amount = document.getElementById("amount");
let category = document.getElementById("category");
let date = document.getElementById("date");

let value = document.getElementById("type")
let description = document.getElementById("description")
let filter = document.getElementById("filter")
let filterCategory = document.getElementById("filterCategory");

let summaryMonth = document.getElementById("summaryMonth");
let summaryYear = document.getElementById("summaryYear");
let summaryOutput = document.getElementById("summaryOutput");

startButton.addEventListener("click", function() {
    home.style.display = "none";
    tracker.style.display = "block";
});

let balance = 0 ;
let list = [] ;
let totalExpense = 0;
let totalIncome = 0 ;
let editIndex ;
let savedList = localStorage.getItem("transactions");
console.log(savedList);
if (savedList != null )
   {list = JSON.parse(savedList);

   }
function calculateTotal(){
   totalExpense = 0;
   totalIncome =  0;
   for (let index = 0; index < list.length; index++) {
         let Mylist = list[index];
   if(Mylist.type == "expense"){
    totalExpense = totalExpense + Mylist.transactionAmount ;
    }
   else {
    totalIncome = totalIncome + Mylist.transactionAmount ;

    }
   }
   balance = totalIncome - totalExpense;
}
function displayTransation(){
let text=" "
    for (let index = 0; index < list.length; index++) {
         let Mylist = list[index];
        

    text = text + "<div class=\"transaction\">"
        + Mylist.type + " | "
        + Mylist.transactionAmount +".Rs"+ " | "
        + Mylist.category + " | "
        + Mylist.dateOfTransaction + " | "
        + Mylist.details
        + "<br>"
        + "<button data-delete-index=\"" + index + "\">delete</button>"
        + "<button data-edit-index=\"" + index + "\">edit</button>"
        + "</div>";
    }
         
    
    output.innerHTML="transaction list : "+"<br>"+ text  + 
    "<br>"+"total expense "+ totalExpense+"<br>"+ "total income"
    +totalIncome+"<br>"+"remaining balance"+balance;
     let deleteButtons = document.querySelectorAll("[data-delete-index]")
    for (let index = 0; index < deleteButtons.length; index++) {
        deleteButtons[index].addEventListener("click",function(){
        let deleteIndex = deleteButtons[index].dataset.deleteIndex ;
        list.splice(deleteIndex,1);
        localStorage.setItem("transactions",JSON.stringify(list))
        calculateTotal();
        displayTransation();
    })
}
    let editButtons = document.querySelectorAll("[data-edit-index]")
    for (let index = 0; index < editButtons.length; index++) {
        editButtons[index].addEventListener("click",function(){
        editIndex = editButtons[index].dataset.editIndex ;
        let editTransaction =list[editIndex];
         console.log(list[editIndex]);
         amount.value = editTransaction.transactionAmount ;
         value.value = editTransaction.type
         date.value = editTransaction.dateOfTransaction;
         category.value = editTransaction.category;
         description.value= editTransaction.details;
    })
    
} 
    displayFilteredTransation();
    monthlySummary();
}
    
calculateTotal();
displayTransation();
button.addEventListener("click",function(){
    
    if (amount.value === "") {
        alert("Please enter an amount");
        return;
    }
    if (Number(amount.value) <= 0) {
    alert("Amount must be greater than 0");
    return;
   }
    if (date.value === "") {
        alert("Please select a date");
        return;
    }

    let transaction = {
    type : value.value,
    transactionAmount : Number(amount.value),
    category: category.value,
    details: description.value,
    dateOfTransaction   : date.value
    }
    if (editIndex != undefined){
    list[editIndex] = transaction;
    editIndex = undefined
    }
    else{
    list.push(transaction);
    
    }
    localStorage.setItem("transactions",JSON.stringify(list))
    console.log(list)
    calculateTotal();
    displayTransation();

});
filter.addEventListener("change",displayFilteredTransation);

filterCategory.addEventListener("change",displayFilteredTransation);

function displayFilteredTransation(){
 let text=" "
  for (let index = 0; index < list.length; index++) {
         let Mylist = list[index];
         
         if((filter.value === "all" || Mylist.type === filter.value) && 
         (filterCategory.value === "all" || Mylist.category === filterCategory.value)){
            text= text + Mylist.type + " | "
                 + Mylist.transactionAmount +".Rs"+ " | "
                 + Mylist.category + " | "
                 + Mylist.dateOfTransaction + " | "
                 + Mylist.details
                 + "<br>"
         
         
    }
   }
   fOutput.innerHTML="transaction list = "+"<br>"+ text+"<br>";
}
displayFilteredTransation();

summaryMonth.addEventListener(
    "change",
    monthlySummary
);

summaryYear.addEventListener(
    "change",
    monthlySummary
);


function monthlySummary() {

    let monthlyExpense = 0;
    let monthlyIncome = 0;
    let selectedMonth =
        summaryYear.value + "-" + summaryMonth.value;

    for (let index = 0; index < list.length; index++) {

        let Mylist = list[index];
        if (
            Mylist.dateOfTransaction.substring(0, 7)
            === selectedMonth
        ) {
            if (Mylist.type === "expense") {

                monthlyExpense =
                    monthlyExpense
                    + Mylist.transactionAmount;

            }

            else {
                monthlyIncome =
                    monthlyIncome
                    + Mylist.transactionAmount;
            }
        }
    }


    let monthlyBalance =
        monthlyIncome - monthlyExpense;

    summaryOutput.innerHTML =
        "Monthly Summary"
        + "<br>"
        + "Income: " + monthlyIncome + " Rs"
        + "<br>"
        + "Expenses: " + monthlyExpense + " Rs"
        + "<br>"
        + "Balance: " + monthlyBalance + " Rs";

}

monthlySummary();