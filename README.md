# BookWala

A full‑stack book shopping application where users can create accounts, log in securely, search any book, read about the book, buy book and add book to the wishlist to buy later. Built with a React frontend, Express/Node backend, MongoDB databases.

## Demo Link

[Live Demo](https://bookwala-tool.vercel.app)

## Quick Start

```
git clone https://github.com/vickykumar3510/BookWala_frontend.git
cd <BookWala_frontend>
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
**Login**
- User login form with email and password fields
- Incorrect password alerts shown
- Successful login redirects to dashboard

**Sign Up**
- User account creation form provided
- Success alert shown on account creation
- Navigation link back to Sign‑In page
- Input validation ensures phone number must be exactly 10 digits

**Dashboard**
- Displays list of books with navigation to book details
- Filtering options: book name, author, genre, ratings
- Sorting by price (low to high / high to low)
- Add books to cart or wishlist directly from dashboard

**Book Detail**
- Displays complete information about the selected book: author, genre, description, rating, and price
- Provides Add to Cart button for immediate purchase intent
- Provides Add to Wishlist button for saving books to wishlist

**Profile**
- Displays signed‑in user’s name, email, and phone number
- Add/Edit address form available
- Address cannot be saved unless phone number is 10 digits
- Displays all orders sorted by latest order first

**Wishlist**
- Displays all books added to wishlist
- Options to Add to Cart or Remove from wishlist
- Search bar to find books within wishlist

**Cart**
- Displays all books added to cart
- Options to Add to Wishlist, Remove, or adjust Quantity
- Search bar to find books within cart
- User cannot place order until a delivery address is selected
- Navigation link to address form available
- Shows total cart summary (books + price)

**Checkout**
- Displays all ordered books with details
- Shows selected delivery address and book information
- Cart is cleared once order is placed

##API Reference
--

**POST /api/auth/signup**<br>
Register new user<br>

Sample Response:
```
{ message }
```

**POST /api/auth/login**<br>
Login user<br>

Sample Response:
```
{ message, token }
```

**GET /api/auth/me**<br>
Get authenticated user details<br>

Sample Response:
```
{ user: { _id, name, email } }
```

**GET /api/book**<br>
List all books<br>

Sample Response:
```
[{ _id, title, author, genre, status, createdAt, updatedAt }]
```

**POST /api/book**<br>
Add new book<br>

Sample Response:
```
{ _id, title, author, genre, status, createdAt, updatedAt }
```

**PUT /api/book/:id**<br>
Update any book<br>

Sample Response:
```
{ _id, title, author, genre, status, createdAt, updatedAt }
```

**GET /api/book/Genre/:byGenre**<br>
List all books<br>

Sample Response:
```
[{ _id, title, author, genre, status, createdAt, updatedAt }]
```

**GET /api/book/Genre/:byBookName**<br>
List all books<br>

Sample Response:
```
[{ _id, title, author, genre, status, createdAt, updatedAt }]
```

**GET /api/book/Genre/:byAuthor**<br>
List all books<br>

Sample Response:
```
[{ _id, title, author, genre, status, createdAt, updatedAt }]
```

**GET /api/book/Genre/:byRating**<br>
List all books<br>

Sample Response:
```
[{ _id, title, author, genre, status, createdAt, updatedAt }]
```

**GET /api/user**<br>
List all users<br>

Sample Response:
```
{ user: { _id, name, email } }
```

**GET /api/order**<br>
List all ordered books<br>

Sample Response:
```
[{ _id, title, author, genre, status, createdAt, updatedAt }]
```

**POST /api/book**<br>
Place order of book<br>

Sample Response:
```
[{ _id, title, author, genre, status, createdAt, updatedAt }]
```
##Contact 
--
For bugs or feature requests, please reach out to vicky.kumar3510@gmail.com