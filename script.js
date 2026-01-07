document.addEventListener('DOMContentLoaded', () => {
    const movieGrid = document.getElementById('movieGrid');
    const modal = document.getElementById('movieModal');
    const videoArea = document.getElementById('videoArea');
    const watchBtn = document.getElementById('watchBtn');
    const closeBtn = document.getElementById('closeBtn');

    function renderMovies(data) {
        movieGrid.innerHTML = '';
        data.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <img src="${movie.thumbnail}" alt="${movie.title}" loading="lazy">
                <div class="card-info">
                    <h3>${movie.title}</h3>
                    <div class="meta">
                        <span>${movie.year}</span>
                        <span style="color:#ffb400">★ ${movie.rating}</span>
                    </div>
                </div>
            `;
            card.onclick = () => openModal(movie);
            movieGrid.appendChild(card);
        });
    }

    function openModal(movie) {
        document.getElementById('modalDetails').innerHTML = `
            <h2>${movie.title}</h2>
            <p style="color:#888; margin:5px 0 20px;">${movie.year} | ${movie.category} | ${movie.genre}</p>
        `;
        
        videoArea.innerHTML = '';
        videoArea.style.display = 'none';
        watchBtn.style.display = 'block';
        document.getElementById('downloadBtn').href = movie.downloadUrl;

        watchBtn.onclick = () => {
            if(movie.videoUrl.includes('drive.google.com')) {
                videoArea.innerHTML = `<iframe src="${movie.videoUrl}" allowfullscreen allow="autoplay"></iframe>`;
            } else {
                videoArea.innerHTML = `<video controls autoplay><source src="${movie.videoUrl}" type="video/mp4"></video>`;
            }
            videoArea.style.display = 'block';
            watchBtn.style.display = 'none';
        };

        // Update Movie Schema for Google
        updateSchema(movie);
        modal.style.display = 'block';
    }

    function updateSchema(movie) {
        let script = document.getElementById('movie-json-ld');
        if (!script) {
            script = document.createElement('script');
            script.id = 'movie-json-ld';
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Movie",
            "name": movie.title,
            "image": movie.thumbnail,
            "datePublished": movie.year,
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": movie.rating, "bestRating": "10", "ratingCount": movie.views }
        });
    }

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        videoArea.innerHTML = '';
    };

    // Filter Logic
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            const filtered = f === 'all' ? movies : movies.filter(m => m.category === f || m.genre === f);
            renderMovies(filtered);
        };
    });

    // Search Logic
    document.getElementById('searchInput').oninput = (e) => {
        const val = e.target.value.toLowerCase();
        const filtered = movies.filter(m => m.title.toLowerCase().includes(val));
        renderMovies(filtered);
    };

    renderMovies(movies);
});