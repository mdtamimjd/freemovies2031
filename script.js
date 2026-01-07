document.addEventListener('DOMContentLoaded', () => {
    const movieGrid = document.getElementById('movieGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('movieModal');
    const closeModal = document.querySelector('.close-modal');

    // 1. Render Movies
    function renderMovies(filter = 'all', search = '') {
        movieGrid.innerHTML = '';
        const filtered = movies.filter(m => {
            const matchesFilter = filter === 'all' || m.category === filter || m.genre === filter;
            const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        filtered.forEach(movie => {
            // Get local views count or use default
            const localViews = localStorage.getItem(`views_${movie.id}`) || movie.views;
            
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <img src="${movie.thumbnail}" alt="${movie.title}" loading="lazy">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <div class="meta">
                        <span>${movie.year}</span>
                        <span class="rating"><i class="fas fa-star"></i> ${movie.rating}</span>
                        <span><i class="fas fa-eye"></i> ${localViews}</span>
                    </div>
                </div>
            `;
            card.onclick = () => openModal(movie);
            movieGrid.appendChild(card);
        });
    }

    // 2. Filter Logic
    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMovies(btn.dataset.filter);
        };
    });

    // 3. Search Logic
    searchInput.oninput = (e) => renderMovies('all', e.target.value);

    // 4. Modal Logic
    function openModal(movie) {
        const modalDetails = document.getElementById('modalDetails');
        const watchBtn = document.getElementById('watchBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const videoContainer = document.getElementById('videoContainer');
        const videoPlayer = document.getElementById('videoPlayer');

        // Increment Views
        let currentViews = parseInt(localStorage.getItem(`views_${movie.id}`)) || movie.views;
        localStorage.setItem(`views_${movie.id}`, currentViews + 1);

        modalDetails.innerHTML = `
            <h2>${movie.title}</h2>
            <p style="color: #aaa; margin: 10px 0;">${movie.year} • ${movie.category} • Rating: ${movie.rating}</p>
            <img src="${movie.thumbnail}" style="width: 150px; border-radius: 8px; margin-bottom: 15px;">
        `;

        watchBtn.onclick = () => {
            videoPlayer.src = movie.videoUrl;
            videoContainer.style.display = 'block';
        };

        downloadBtn.href = movie.downloadUrl;
        modal.style.display = 'block';
        renderMovies(); // Refresh grid views
    }

    closeModal.onclick = () => {
        modal.style.display = 'none';
        document.getElementById('videoPlayer').src = ''; // Stop video
        document.getElementById('videoContainer').style.display = 'none';
    };

    // Scroll Top
    const scrollBtn = document.getElementById('scrollTop');
    window.onscroll = () => {
        scrollBtn.style.display = window.scrollY > 500 ? 'block' : 'none';
    };
    scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    renderMovies();
});