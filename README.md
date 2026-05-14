# BookWala

A full-stack book shopping app where you can search any book, read about the book, buy book and add book to the cart for buy later.
Built with a React frontend, Express/Node backend, MongoDB databases.

## Demo Link

[Live Demo](https://bookwala-app.vercel.app/)

## Quick Start

```
git clone https://github.com/vickykumar3510/bookwala_frontend.git
cd <bookwala_frontend>
npm install
npm run dev
```
## Technologies
- React JS
- React Router
- Node JS
- Express
- MongoDB
- JWT
- bcryptjs

## Demo Video
Watch a walkthrough of all the major features of this app: [Google Drive Link]()

## Features
**Home**
- Featured books and filter button for get all the books by Genre
- Search bar where you can search book by Title, Author and Genre

**All Books**
- Display all the books with "Add to Cart" and "Add to Wishlist" button
- Add filters:- Sort by price, filter by genre, filter by rating

**Pofile**
- User information
- Order history regarding to purchased date
- Add and Edit address

**Wishlist**
- Showing Total Wishlist Items
- Added books with "Add to Cart" and "Remove" button

**Cart**
- Showing Total Items in the Cart
- Showing Total Number of books and Total Amount
- Cannot proceed to checkout without selecting the address
- A button is also there for adding new address

**Book Details**
- Image, Rating, Price, Genre of the book
- "Add to Cart" and "Add to Wishlist" button
- Description about the book

##API Reference
--
**GET/api/books**<br>
List of all the books<br>

Sample Response:
```
[{_id, bookAuthor, bookName, bookImage, bookPrice, bookDescription, bookRating, bookGenre, createdAt, updatedAt, __v}]
```

**GET/api/books/bookGenre/:byGenre**<br>
List of all the books by Genre<br>

Sample Response:

```
[{_id, bookAuthor, bookName, bookImage, bookPrice, bookDescription, bookRating, bookGenre, createdAt, updatedAt, __v
}]
```

**GET/api/books/bookRating/:byRating**<br>
List of all the books by Rating<br>

Sample Response:

```
[{_id, bookAuthor, bookName, bookImage, bookPrice, bookDescription, bookRating, bookGenre, createdAt, updatedAt, __v
}]
```

**GET/api/books/bookPrice/:byPrice**<br>
List of all the books by Price<br>

Sample Response:

```
[{_id, bookAuthor, bookName, bookImage, bookPrice, bookDescription, bookRating, bookGenre, createdAt, updatedAt, __v
}]
```

**GET/api/books/bookName/:byName**<br>
List of all the books by Book Name<br>

Sample Response:

```
[{_id, bookAuthor, bookName, bookImage, bookPrice, bookDescription, bookRating, bookGenre, createdAt, updatedAt, __v
}]
```
**POST/api/place-order**<br>
For save the book orders<br>
```
[{orderDateTime, _id, items, createdAt, updatedAt, __v
}]
```

##Contact 
--
For bugs or feature requests, please reach out to vicky.kumar3510@gmail.com