

// MOVIE LIST & WATCHLIST LOGIC
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

const modal = document.getElementById('movieModal');

if (modal) {
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalAddBtn = document.getElementById('modalAddBtn');
    const closeBtn = document.querySelector('.close-btn');

    // ADD TO WATCHLIST
    document.querySelectorAll('.add-btn').forEach(button => {
        
        if(button.id !== "modalAddBtn") {
            button.addEventListener('click', function() {
                const title = this.getAttribute('data-title');
                addToWatchlist(title);
            });
        }
    });

    // Open Modal Logic
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

    // "Add to Watchlist" 
    modalAddBtn.addEventListener('click', function() {
        const title = this.getAttribute('data-title');
        addToWatchlist(title);
        modal.style.display = "none"; // Optionally close modal after adding
    });

    // Helper function to handle adding and saving
    function addToWatchlist(title) {
        if (!watchlist.some(m => m.title === title)) {
            watchlist.push({ title: title, status: "Not Yet" });
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            alert(title + " added to your watchlist!");
        } else {
            alert(title + " is already in your watchlist!");
        }
    }

    //  Close Modal Events
    closeBtn.addEventListener('click', function() { modal.style.display = "none"; });
    window.addEventListener('click', function(event) {
        if (event.target == modal) modal.style.display = "none";
    });
} 

//  WATCHLIST.HTML LOGIC 
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
