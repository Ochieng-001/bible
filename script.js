// script.js
document.addEventListener('DOMContentLoaded', () => {
    const books = [
        "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
        "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
        "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
        "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
        "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
        "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
        "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
        "Zephaniah", "Haggai", "Zechariah", "Malachi",
        "Matthew", "Mark", "Luke", "John", "Acts",
        "Romans", "1 Corinthians", "2 Corinthians", "Galatians",
        "Ephesians", "Philippians", "Colossians", "1 Thessalonians",
        "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus",
        "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
        "1 John", "2 John", "3 John", "Jude", "Revelation"
    ];

    const bookSelect = document.getElementById('bookSelect');
    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book;
        option.textContent = book;
        bookSelect.appendChild(option);
    });

    const modal = document.getElementById("verseModal");
    const span = document.getElementsByClassName("close")[0];

    document.getElementById('searchButton').addEventListener('click', () => {
        const book = document.getElementById('bookSelect').value;
        const chapter = document.getElementById('chapterInput').value;
        const verseStart = document.getElementById('verseStartInput').value;
        const verseEnd = document.getElementById('verseEndInput').value;
        const verseDisplay = document.getElementById('verseDisplay');
        const modalBody = document.getElementById('modalBody');
        const loadingSpinner = document.getElementById('loadingSpinner');

        verseDisplay.innerHTML = '';
        modalBody.innerHTML = '';
        loadingSpinner.style.display = 'inline-block';

        if (!chapter) {
            loadingSpinner.style.display = 'none';
            verseDisplay.innerHTML = 'Please enter a chapter.';
            return;
        }

        let query = `${book} ${chapter}`;
        if (verseStart) {
            query += `:${verseStart}`;
            if (verseEnd) {
                query += `-${verseEnd}`;
            }
        }

        fetch(`https://bible-api.com/${query}`)
            .then(response => response.json())
            .then(data => {
                loadingSpinner.style.display = 'none';
                if (data.error) {
                    verseDisplay.innerHTML = 'Verse not found. Please check your input and try again.';
                } else {
                    let verses = Array.isArray(data.verses) ? data.verses : [data];
                    verses.forEach(verse => {
                        modalBody.innerHTML += `<strong>${verse.book_name} ${verse.chapter}:${verse.verse}</strong><br>${verse.text}<br><br>`;
                    });
                    modal.style.display = "block";
                }
            })
            .catch(error => {
                loadingSpinner.style.display = 'none';
                verseDisplay.innerHTML = 'An error occurred. Please try again later.';
                console.error('Error fetching the verse:', error);
            });
    });

    // Close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
