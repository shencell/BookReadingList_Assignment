import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [bookTitle, setBookTitle] = useState('');
  const [bookStatus, setBookStatus] = useState('completed');
  const [lastChapter, setLastChapter] = useState('');
  const [updateBookId, setUpdateBookId] = useState(null);
  const [updateBookTitle, setUpdateBookTitle] = useState('');
  const [updateBookStatus, setUpdateBookStatus] = useState('');
  const [updateLastChapter, setUpdateLastChapter] = useState('');

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (bookTitle) {
      const response = await fetch('http://localhost:5000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: bookTitle, status: bookStatus, lastChapter }),
      });
      if (response.ok) {
        const newBook = await response.json();
        setBooks([...books, newBook]);
        setBookTitle('');
        setLastChapter('');
      }
    }
  };

  const fetchBooks = async () => {
    const response = await fetch('http://localhost:5000/books');
    if (response.ok) {
      const data = await response.json();
      setBooks(data);
    }
  };

  const handleDeleteBook = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (confirmDelete) {
      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBooks(books.filter(book => book.id !== id));
      }
    }
  };

  const handleUpdateBook = async (id) => {
    setUpdateBookId(id);
    const book = books.find(book => book.id === id);
    setUpdateBookTitle(book.title);
    setUpdateBookStatus(book.status);
    setUpdateLastChapter(book.lastChapter);
  };

  const handleSaveUpdateBook = async () => {
    const response = await fetch(`http://localhost:5000/books/${updateBookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: updateBookTitle, status: updateBookStatus, lastChapter: updateLastChapter }),
    });
    if (response.ok) {
      const updatedBook = await response.json();
      setBooks(books.map(book => book.id === updateBookId ? updatedBook : book));
      setUpdateBookId(null);
      setUpdateBookTitle('');
      setUpdateBookStatus('');
      setUpdateLastChapter('');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <h1>Read Books List</h1>
      <form onSubmit={handleAddBook}>
        <input
          type="text"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          placeholder="Book Title"
        />
        <select
          value={bookStatus}
          onChange={(e) => setBookStatus(e.target.value)}
        >
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
        </select>
        {bookStatus === 'ongoing' && (
          <input
            type="text"
            value={lastChapter}
            onChange={(e) => setLastChapter(e.target.value)}
            placeholder="Last Chapter Read"
          />
        )}
        <button type="submit">Add Book</button>
      </form>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - {book.status} {book.status === 'ongoing' && ` (Last Chapter: ${book.lastChapter})`}
            <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
            <button onClick={() => handleUpdateBook(book.id)}>Update</button>
            {updateBookId === book.id && (
              <div>
                <input
                  type="text"
                  value={updateBookTitle}
                  onChange={(e) => setUpdateBookTitle(e.target.value)}
                  placeholder="Book Title"
                />
                <select
                  value={updateBookStatus}
                  onChange={(e) => setUpdateBookStatus(e.target.value)}
                >
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                </select>
 {updateBookStatus === 'ongoing' && (
                  <input
                    type="text"
                    value={updateLastChapter}
                    onChange={(e) => setUpdateLastChapter(e.target.value)}
                    placeholder="Last Chapter Read"
                  />
                )}
                <button onClick={handleSaveUpdateBook}>Save</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
