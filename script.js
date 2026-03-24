// ==========================================
// 1. SIGN UP PAGE LOGIC (Saves to Local Storage)
// ==========================================
const signupForm = document.getElementById('signupForm');

if (signupForm) {
    const fullName = document.getElementById('fullName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const signupError = document.getElementById('signupError');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        signupError.innerHTML = '';
        signupError.style.display = 'none';
        let errors = [];

        if (fullName.value.trim() === "") errors.push("Full Name is required.");
        if (signupEmail.value.trim() === "") errors.push("Email is required.");
        if (signupPassword.value.trim() === "") errors.push("Password is required.");
        if (signupPassword.value !== confirmPassword.value) errors.push("Passwords do not match!");

        if (errors.length > 0) {
            errors.forEach(errorText => {
                const p = document.createElement('p');
                p.textContent = "• " + errorText;
                signupError.appendChild(p);
            });
            signupError.style.display = 'block';
        } else {
            // --- LOCAL STORAGE: Save User ---
            let users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if email already exists
            const userExists = users.some(u => u.email === signupEmail.value);
            if (userExists) {
                const p = document.createElement('p');
                p.textContent = "• Email already registered.";
                signupError.appendChild(p);
                signupError.style.display = 'block';
                return;
            }

            users.push({
                name: fullName.value,
                email: signupEmail.value,
                password: signupPassword.value // Note: In a real app, never store plain text passwords!
            });
            
            localStorage.setItem('users', JSON.stringify(users));
            alert("Account created successfully!");
            window.location.href = "index.html"; // Send to login
        }
    });
}

// ==========================================
// 2. LOGIN PAGE LOGIC (Reads from Local Storage)
// ==========================================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        loginError.innerHTML = '';
        loginError.style.display = 'none';

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === "" || password === "") {
            const errorMsg = document.createElement('p');
            errorMsg.textContent = "Please fill in both email and password.";
            loginError.appendChild(errorMsg);
            loginError.style.display = 'block';
        } else {
            // --- LOCAL STORAGE: Verify User ---
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const validUser = users.find(u => u.email === email && u.password === password);

            if (validUser) {
                // Save current logged in user
                localStorage.setItem('currentUser', JSON.stringify(validUser));
                window.location.href = "movies.html";
            } else {
                const errorMsg = document.createElement('p');
                errorMsg.textContent = "Invalid email or password.";
                loginError.appendChild(errorMsg);
                loginError.style.display = 'block';
            }
        }
    });
}

// ==========================================
// 3. MOVIE LIST & WATCHLIST LOGIC (Split Pages)
// ==========================================

// Global Watchlist Array from Local Storage
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

const modal = document.getElementById('movieModal');

if (modal) {
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalAddBtn = document.getElementById('modalAddBtn');
    const closeBtn = document.querySelector('.close-btn');

    // 1. "Add to Watchlist" from static cards on the main page
    document.querySelectorAll('.add-btn').forEach(button => {
        // Only target buttons on the cards, not the one in the modal yet
        if(button.id !== "modalAddBtn") {
            button.addEventListener('click', function() {
                const title = this.getAttribute('data-title');
                addToWatchlist(title);
            });
        }
    });

    // 2. Open Modal Logic (Populates Image, Title, and Description)
    document.querySelectorAll('.info-btn').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const info = this.getAttribute('data-info');
            const imgSrc = this.getAttribute('data-img');
            
            // Inject data into modal
            modalTitle.textContent = title;
            modalText.textContent = info;
            modalImg.src = imgSrc;
            
            // Pass the movie title to the modal's Add button
            modalAddBtn.setAttribute('data-title', title);
            
            // Show modal
            modal.style.display = "block";
        });
    });

    // 3. "Add to Watchlist" from INSIDE the Modal
    modalAddBtn.addEventListener('click', function() {
        const title = this.getAttribute('data-title');
        addToWatchlist(title);
        modal.style.display = "none"; // Optionally close modal after adding
    });

    // 4. Helper function to handle adding and saving
    function addToWatchlist(title) {
        if (!watchlist.some(m => m.title === title)) {
            watchlist.push({ title: title, status: "Not Yet" });
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            alert(title + " added to your watchlist!");
        } else {
            alert(title + " is already in your watchlist!");
        }
    }

    // 5. Close Modal Events
    closeBtn.addEventListener('click', function() { modal.style.display = "none"; });
    window.addEventListener('click', function(event) {
        if (event.target == modal) modal.style.display = "none";
    });
} 

// --- B. WATCHLIST.HTML LOGIC (Form & Table) ---
const addMovieForm = document.getElementById('addMovieForm');

if (addMovieForm) {
    const movieTitleInput = document.getElementById('movieTitle');
    const errorMsg = document.getElementById('error-msg');
    const watchlistBody = document.getElementById('watchlistBody');

    // Render existing movies on page load
    watchlist.forEach((movie, index) => {
        buildTableRow(movie.title, movie.status, index);
    });

    // Form Event Listener
    addMovieForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const title = movieTitleInput.value.trim();

        if (title === "") {
            errorMsg.style.display = "block";
        } else {
            errorMsg.style.display = "none";
            watchlist.push({ title: title, status: "Not Yet" });
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            buildTableRow(title, "Not Yet", watchlist.length - 1);
            movieTitleInput.value = ""; 
        }
    });

    function buildTableRow(title, status, index) {
        const tr = document.createElement('tr');
        const tdTitle = document.createElement('td');
        tdTitle.textContent = title;

        const tdStatus = document.createElement('td');
        const statusBtn = document.createElement('button');
        statusBtn.textContent = status;
        statusBtn.classList.add('status-btn');
        if (status === "Done") statusBtn.style.backgroundColor = "#28a745"; 

        statusBtn.addEventListener('click', function() {
            if (statusBtn.textContent === "Not Yet") {
                statusBtn.textContent = "Done";
                statusBtn.style.backgroundColor = "#28a745"; 
                watchlist[index].status = "Done";
            } else {
                statusBtn.textContent = "Not Yet";
                statusBtn.style.backgroundColor = "#ffc107"; 
                watchlist[index].status = "Not Yet";
            }
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
        });
        tdStatus.appendChild(statusBtn);

        const tdAction = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function() {
            tr.remove(); 
            watchlist.splice(index, 1);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            location.reload(); 
        });
        tdAction.appendChild(deleteBtn);

        tr.appendChild(tdTitle);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAction);
        watchlistBody.appendChild(tr);
    }
}
