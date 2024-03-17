function tambah_book() {
    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;
    var year = document.getElementById('year').value;
    var isComplete = document.getElementById('isComplete').checked;

    if (title.trim() === '' || author.trim() === '' || year.trim() === '') {
        alert('Pastikan judul, penulis, dan tahun terbit buku sudah anda isi dengan benar');
        return;
    }

    var timestamp = +new Date();
    var bookId = 'book_' + timestamp;

    var book = {
        id: bookId,
        title: title,
        author: author,
        year: year,
        isComplete: isComplete
    };

    var existingBooks = JSON.parse(localStorage.getItem('books')) || [];
    existingBooks.push(book);
    localStorage.setItem('books', JSON.stringify(existingBooks));
    var cardContainer = isComplete ? document.getElementById('sudahDibaca') : document.getElementById('belumDibaca');
    tambah_cardbook(book, cardContainer);
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('year').value = '';
    document.getElementById('isComplete').checked = false;

    alert('Buku anda berhasil ditambahkan');

}

function tambah_cardbook(book, container) {
    var card = document.createElement('div');
    card.className = 'bookCard';
    card.id = book.id;
    card.innerHTML = '<h3>' + book.title + '</h3>' +
        '<p>Penulis: ' + book.author + '</p>' +
        '<p>Tahun Terbit: ' + book.year + '</p>' +
        '<p>Status: ' + (book.isComplete ? 'Sudah Dibaca' : 'Belum Dibaca') + '</p>' +
        '<button onclick="moveBook(\'' + book.id + '\')">' +
        (book.isComplete ? '<i class="fa-solid fa-book"></i> Jadikan belum dibaca' : '<i class="fa-solid fa-check"></i> Tandai sudah dibaca') +
        '</button>' +
        '<button class="deleteButton" onclick="hapus_book(\'' + book.id + '\')"><i class="fa-solid fa-trash"></i> Hapus</button>' +
        '<button class="editButton" onclick="editBook(\'' + book.id + '\')"><i class="fa-regular fa-pen-to-square"></i> Edit</button>';

    container.appendChild(card);
}

function editBook(bookId) {
    var bookData = JSON.parse(localStorage.getItem('books')) || [];
    var editedBook = bookData.find(function (book) {
        return book.id === bookId;
    });

    var bookCard = document.getElementById(bookId);
    var editForm = document.getElementById('editForm');

    var belumDibacaContainer = document.getElementById('belumDibaca');
    var isComplete = bookCard.parentElement.id === 'sudahDibaca';

    if (isComplete) {
        belumDibacaContainer.appendChild(editForm);
    }

    var parentContainer = bookCard.parentElement;
    parentContainer.insertBefore(editForm, bookCard.nextSibling);
    editForm.style.display = 'block';

    if (editedBook) {
        document.getElementById('editTitle').value = editedBook.title || '';
        document.getElementById('editAuthor').value = editedBook.author || '';
        document.getElementById('editYear').value = editedBook.year || '';
        document.getElementById('editIsComplete').checked = editedBook.isComplete || false;

        document.getElementById('editedBookId').value = editedBook.id;

        document.getElementById('editForm').style.display = 'block';
    } else {
        console.error("Mohon maaf buku tidak ditemukan");
    }
}


function simpan_update() {
    var editedBookId = document.getElementById('editedBookId').value;
    var editedBookData = {
        id: editedBookId,
        title: document.getElementById('editTitle').value,
        author: document.getElementById('editAuthor').value,
        year: document.getElementById('editYear').value,
        isComplete: document.getElementById('editIsComplete').checked
    };

    var bookData = JSON.parse(localStorage.getItem('books')) || [];
    var index = bookData.findIndex(function (book) {
        return book.id === editedBookId;
    });

    bookData[index] = editedBookData;
    localStorage.setItem('books', JSON.stringify(bookData));

    alert('Data buku anda berhasil diperbaharui');

    location.reload();
}

function moveBook(bookId) {
    var bookCard = document.getElementById(bookId);
    var isComplete = bookCard.parentElement.id === 'sudahDibaca';
    var destinationContainer = isComplete ? document.getElementById('belumDibaca') : document.getElementById('sudahDibaca');
    destinationContainer.appendChild(bookCard);
    var existingBooks = JSON.parse(localStorage.getItem('books')) || [];
    var updatedBooks = existingBooks.map(function (book) {
        if (book.id === bookId) {
            book.isComplete = !isComplete;
        }
        return book;
    });
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    alert('Buku anda berhasil dipindahkan');
}

function hapus_book(bookId) {
    var confirmation = confirm('Apakah Anda yakin ingin menghapus buku ini?');
    if (confirmation) {
        var bookCard = document.getElementById(bookId);
        bookCard.remove();
        var existingBooks = JSON.parse(localStorage.getItem('books')) || [];
        var updatedBooks = existingBooks.filter(function (book) {
            return book.id !== bookId;
        });
        localStorage.setItem('books', JSON.stringify(updatedBooks));
        alert('Buku berhasil dihapus');
    } else {
        alert('Penghapusan buku anda dibatalkan');
    }
}

function caribook() {
    var input, filter, cards, cardContainer, title, i;
    input = document.getElementById('input_cari');
    filter = input.value.toUpperCase();
    cards = document.querySelectorAll('.bookCard');
    cards.forEach(function (card) {
        title = card.querySelector('h3');
        if (title.innerText.toUpperCase().indexOf(filter) > -1) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}


function show_book() {
    var existingBooks = JSON.parse(localStorage.getItem('books')) || [];
    var belumDibacaContainer = document.getElementById('belumDibaca');
    var sudahDibacaContainer = document.getElementById('sudahDibaca');
    existingBooks.forEach(function (book) {
        var cardContainer = book.isComplete ? sudahDibacaContainer : belumDibacaContainer;
        tambah_cardbook(book, cardContainer);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('bookForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Mencegah formulir untuk melakukan submit
        tambah_book();
    });
});

show_book();



