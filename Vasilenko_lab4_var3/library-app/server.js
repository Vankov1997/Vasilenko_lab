const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));

let items = [
    { id: 1, title: "Война и мир", author: "Лев Толстой", year: 1869, genre: "Роман" },
    { id: 2, title: "Преступление и наказание", author: "Фёдор Достоевский", year: 1866, genre: "Роман" },
    { id: 3, title: "Мастер и Маргарита", author: "Михаил Булгаков", year: 1967, genre: "Роман" },
];

app.get("/", (req, res) => {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.title}</td>
          <td>${item.author}</td>
          <td>${item.year}</td>
          <td>${item.genre}</td>
          <td>
            <form method="POST" action="/delete/${item.id}" style="display:inline">
              <button type="submit">❌ Удалить</button>
            </form>
          </td>
        </tr>
      `
    )
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Список книг</title>
      <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        background-color: #f4f4f4;
      }
      h1 {
        color: #333;
      }
      table { 
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
      }
      td, th { 
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd; 
      }
      th {
        background-color: #4CAF50;
        color: white;
      }
      .form-container {
        background: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        margin: 20px 0;
      }
      input, select {
        padding: 8px;
        margin: 5px;
        width: 200px;
      }
      button {
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin: 5px;
      }
        form { margin: 0; }
      </style>
    </head>
    <body>
      <h1>📚 Управление библиотекой</h1>

      <div class="form-container">
      <h2>Добавить новую книгу</h2>
      <form method="POST" action="/add">
        <h3>Добавить новую книгу</h3>
        <input name="title" placeholder="Название книги" required />
        <input name="author" placeholder="Автор" required />
        <input name="year" type="number" placeholder="Год издания" required />
        <input name="genre" placeholder="Жанр" required />
        <button type="submit">Добавить</button>
      </form>
      <h2>Список книг</h2>

      <table>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Автор</th>
          <th>Год</th>
          <th>Жанр</th>
          <th>Действия</th>
        </tr>
        ${rows}
      </table>


    </body>
    </html>
  `);
});

app.post("/add", (req, res) => {
  const { title, author, year, genre } = req.body;

  items.push({
    id: Date.now(), // уникальный id
    title,
    author,
    year: parseInt(year),
    genre
  });

  res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
  const id = Number(req.params.id);

  items = items.filter((item) => item.id !== id);

  res.redirect("/");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
