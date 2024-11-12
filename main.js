const userName = document.querySelector('input[name="userName"]')
const userPassWord = document.querySelector('input[name="userPassword"]')
const loginForm = document.getElementById('form')
const bookingForm = document.getElementById('Bform')
const loginButton = document.querySelector('button[name="login"]')
const modal = document.querySelector('.container-msg-modal')
const modalContent = document.querySelectorAll('.container-modal-content')

const myLogin = {
    userName: 'user@gmail.com',
    password: 'password'
}

// Get the header element
// Get the header element
const header = document.getElementById('main-header');

// Function to handle scroll event
function handleScroll() {
    if (window.scrollY > 0) {
        // Add the header-scrolled class when scrolling down
        header.classList.add('header-scrolled');
    } else {
        // Remove the header-scrolled class when scrolling up to the top
        header.classList.remove('header-scrolled');
    }
}

// Listen for scroll events
window.addEventListener('scroll', handleScroll);

class Auth {
    // setup the class and hide the body by default
    constructor() {
        const auth = localStorage.getItem("auth");
        this.validateAuth(auth);
    }
    // check to see if the localStorage item passed to the function is valid and set
    validateAuth(auth) {
        if (auth != 1) {
            loginButton.innerHTML = "Login";
            document.querySelector("body").style.display = "block";
        } else {
            loginButton.innerHTML = "Logout";
            loginButton.addEventListener("click", this.logOut);
            document.querySelector("body").style.display = "block";
        }
    }
    // will remove the localStorage item and redirect to login  screen
    logOut() {
        localStorage.removeItem("auth");
    }
}

const auth = new Auth();


window.onload = init()

function init() {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault()
        userLogin()
    })

    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault()
        window.location.href= './payment.html'
        const formData = new FormData(e.target);
        console.log(formData)

    });
}

function userLogin() {
    const nameVal = userName.value,
        passwordVal = userPassWord.value
    
    const isLogin = false
    
    if(nameVal === myLogin.userName && passwordVal === myLogin.password) {
      loginCheck(!isLogin)
    } else {
      loginCheck(isLogin)
    }
}

function tempAlert(msg,duration)
{
    const el = document.createElement("div");
    el.setAttribute("style","position:fixed; top: 6rem; padding: 10px; border: 2px solid black; border-radius: 5px; right:20px; background-color:white;");
    el.innerHTML = msg;
    setTimeout(function(){
        el.parentNode.removeChild(el);
    },duration);
    document.body.appendChild(el);
}

function loginCheck(isLogin) {
  if(isLogin) {
      tempAlert('Login Successful', 3000);
      localStorage.setItem('auth', 1);
      setTimeout(function(){
          window.location.href = './index.html'
      }, 3000);
  } else {
      tempAlert('Login Failed! Username or Password is incorrect', 3000);
      localStorage.setItem('auth', 0);
  }
  
  setTimeout(function() {
    modal.classList.remove('enabled')
    loginForm.reset();
    modalContent.forEach(function(content) {
      content.classList.remove('enabled')
    });
  }, 3000)
}

function like(id){
    document.getElementById(id).classList.toggle('liked');
}

function paymentdone(){
    tempAlert('Payment Successful', 1000);
    setTimeout(function(){
        window.location.href = './index.html'
    }, 1500);
}
         function togglePasswordVisibility() {
            const passwordInput = document.getElementById("password-input");
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
         }
function bookRoom(event){
    event.preventDefault()

    console.log('booking')
    const name = document.querySelector('input[name="name"]')
    const email = document.querySelector('input[name="email"]')
    const phone = document.querySelector('input[name="phone"]')
    const checkin = document.querySelector('input[name="checkin"]')
    const checkout = document.querySelector('input[name="checkout"]')

    // const formData = new FormData(event.target);
    if(confirm("name: " + name.value + "\nemail: " + email.value + "\nphone: " + phone.value + "\ncheck in date: " + checkin.value + "\ncheckout date: " + checkout.value, "Confirm Booking")==true)
        window.location.href = './payment.html'
    else{
        alert("Booking Cancelled")
        window.location.href = './index.html'
    }
}

const showPasswordBtn = document.getElementById('showPasswordBtn');
const passwordInput = document.getElementById('password');

showPasswordBtn.addEventListener('click', () => {
   if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      showPasswordBtn.textContent = 'Hide';
   } else {
      passwordInput.type = 'password';
      showPasswordBtn.textContent = 'Show';
   }
});

function showPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
function showConfirmPassword() {
    var x = document.getElementById("confirmpassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
function validateForm() {
    var firstname = document.getElementById('firstname').value;
    var lastname = document.getElementById('lastname').value;
    var email = document.getElementById('email').value;
    var phonenumber = document.getElementById('phonenumber').value;
    var password = document.getElementById('password').value;
    var confirmpassword = document.getElementById('confirmpassword').value;

    if (firstname == "" || lastname == "" || email == "" || phonenumber == "" || password == "" || confirmpassword == "") {
        alert("Please fill all the details");
        return false;
    }
    return true;
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    validateForm();
});

function validateForm() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Replace these with actual data from your database
    var correctCredentials = {
        'user@gmail.com': 'password',
        'seconduser@gmail.com': 'secondpassword',
        'thirduser@gmail.com': 'thirdpassword',
        'fourthuser@gmail.com': 'fourthpassword'
    };

    if (email in correctCredentials && password === correctCredentials[email]) {
        window.location.href = 'index.html'; // Redirect to index.html
    } else {
        alert('Invalid email or password');
    }
}

          // Function to update prices based on selected currency
          function updatePrices(currency) {
              const priceElements = document.querySelectorAll('.hotel-info .price'); // Selecting price elements
              priceElements.forEach(element => {
                  const originalPrice = parseFloat(element.getAttribute('data-original-price'));
                  let convertedPrice;
      
                  // Convert price based on selected currency
                  switch(currency) {
                      case 'USD':
                          convertedPrice = originalPrice;
                          element.textContent = `Price per night: $${convertedPrice.toFixed(2)}`;
                          break;
                      case 'INR':
                          convertedPrice = originalPrice * 82.9115; // 1 USD = 74.85 INR
                          element.textContent = `Price per night: ₹${convertedPrice.toFixed(2)}`;
                          break;
                      case 'EUR':
                          convertedPrice = originalPrice * 0.85; // 1 USD = 0.85 EUR
                          element.textContent = `Price per night: €${convertedPrice.toFixed(2)}`;
                          break;
                      case 'AED':
                          convertedPrice = originalPrice * 3.67; // 1 USD = 3.67 AED
                          element.textContent = `Price per night: د.إ${convertedPrice.toFixed(2)}`;
                          break;
                      case 'GBP':
                          convertedPrice = originalPrice * 0.72; // 1 USD = 0.72 GBP
                          element.textContent = `Price per night: £${convertedPrice.toFixed(2)}`;
                          break;
                      case 'CNY':
                          convertedPrice = originalPrice * 6.46; // 1 USD = 6.46 CNY
                          element.textContent = `Price per night: ¥${convertedPrice.toFixed(2)}`;
                          break;                         
                      // Add more cases for other currencies
                  }
              });
          }
      
          // Event listener for currency selection change
          document.getElementById('currency').addEventListener('change', function() {
              const selectedCurrency = this.value;
              updatePrices(selectedCurrency);
          });
      
          // Initial call to update prices based on default currency selection
          updatePrices('INR');

          function convertCurrency(currency = 'INR') {
            var priceElements = document.querySelectorAll('.price');
            
            priceElements.forEach(function(element) {
                var originalPrice = parseFloat(element.getAttribute('data-original-price'));
                var convertedPrice;
                
                switch(currency) {
                    case 'USD':
                        convertedPrice = originalPrice;
                        element.textContent = `Starting from $${convertedPrice.toFixed(2)}/night`;
                        break;
                    case 'INR':
                        convertedPrice = originalPrice * 82.9115; // Conversion rate from USD to INR
                        element.textContent = `Starting from ₹${convertedPrice.toFixed(2)}/night`;
                        break;
                    case 'EUR':
                        convertedPrice = originalPrice * 0.85; // Conversion rate from USD to EUR
                        element.textContent = `Starting from €${convertedPrice.toFixed(2)}/night`;
                        break;
                    case 'AED':
                        convertedPrice = originalPrice * 3.67; // Conversion rate from USD to AED
                        element.textContent = `Starting from د.إ${convertedPrice.toFixed(2)}/night`;
                        break;
                    case 'GBP':
                        convertedPrice = originalPrice * 0.72; // Conversion rate from USD to GBP
                        element.textContent = `Starting from £${convertedPrice.toFixed(2)}/night`;
                        break;
                    case 'CNY':
                        convertedPrice = originalPrice * 6.46; // Conversion rate from USD to CNY
                        element.textContent = `Starting from ¥${convertedPrice.toFixed(2)}/night`;
                        break;
                    // Add more cases for other currencies
                }
            });
        }
        
        // Get a reference to the currency select element
        var currencySelect = document.getElementById('currency');
        
        // Set the default currency to INR
        currencySelect.value = 'INR';
        
        // Add an event listener to detect changes in the currency selection
        currencySelect.addEventListener('change', function() {
            var selectedCurrency = currencySelect.value;
            convertCurrency(selectedCurrency);
        });
        
        // Call the convertCurrency function initially to set the prices based on the default currency
        convertCurrency(currencySelect.value);

        document.getElementById('currency').addEventListener('mouseover', function() {
            this.click();
        });
        
         var mybutton = document.getElementById("back-to-top");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    mybutton.addEventListener('click', backToTop);

    function backToTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    // Show the preloader
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.preloader').style.display = 'block';
});

// Hide the preloader when the page has fully loaded
window.addEventListener("load", function() {
    document.querySelector('.preloader').style.display = 'none';
});

// Sample payment details data
const paymentDetails = [
    { name: "John Doe", bookingDate: "2024-03-06", numOfRooms: 2, amount: "$200" },
    { name: "Jane Smith", bookingDate: "2024-03-07", numOfRooms: 1, amount: "$150" },
    // More payment details...
];

// Get the container element
const container = document.getElementById("paymentDetailsContainer");

// Loop through each payment detail and create HTML elements for display
paymentDetails.forEach(detail => {
    // Create elements
    const paymentDetailElement = document.createElement("div");
    const nameLabel = document.createElement("span");
    const bookingDateLabel = document.createElement("span");
    const numOfRoomsLabel = document.createElement("span");
    const amountLabel = document.createElement("span");

    // Set text content
    nameLabel.textContent = "Guest Name: " + detail.name;
    bookingDateLabel.textContent = "Booking Date: " + detail.bookingDate;
    numOfRoomsLabel.textContent = "Number of Rooms: " + detail.numOfRooms;
    amountLabel.textContent = "Amount: " + detail.amount;

    // Append elements to the container
    paymentDetailElement.appendChild(nameLabel);
    paymentDetailElement.appendChild(bookingDateLabel);
    paymentDetailElement.appendChild(numOfRoomsLabel);
    paymentDetailElement.appendChild(amountLabel);
    
    container.appendChild(paymentDetailElement);
});
