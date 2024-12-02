const { MongoClient } = require('mongodb');  
  
// Connection URL  
const url = 'mongodb+srv://nebah:1234@qap-3.theac.mongodb.net/?retryWrites=true&w=majority&appName=QAP-3';  
const client = new MongoClient(url);  
  
// Database Name  
const dbName = 'bookstore';  
  
async function runQueries() {  
  try {  
   // Connect to the MongoDB server  
   await client.connect();  
   console.log('Connected successfully to server');  
  
   const db = client.db(dbName);  
   const booksCollection = db.collection('books');  
  
   // 1. Create a Collection  
   await db.createCollection('books');  
   console.log('Books collection created');  
  
   // 2. Insert Sample Data  
   const sampleBooks = [  
    { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy" },  
    { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction" },  
    { title: "1984", author: "George Orwell", genre: "Dystopian" },  
    { title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance" }  
   ];  
   await booksCollection.insertMany(sampleBooks);  
   console.log('Sample books inserted');  
  
   // 3. Retrieve the titles of all books  
   const allTitles = await booksCollection.find({}, { projection: { _id: 0, title: 1 } }).toArray();  
   console.log('All book titles:', allTitles);  
  
   // 4. Find all books written by "J.R.R. Tolkien"  
   const tolkienBooks = await booksCollection.find({ author: "J.R.R. Tolkien" }).toArray();  
   console.log('Books by J.R.R. Tolkien:', tolkienBooks);  
  
   // 5. Update the genre of "1984" to "Science Fiction"  
   const updateResult = await booksCollection.updateOne(  
    { title: "1984" },  
    { $set: { genre: "Science Fiction" } }  
   );  
   console.log('Update result:', updateResult.modifiedCount === 1 ? 'Success' : 'Failed');  
  
   // 6. Delete the book "The Hobbit"  
   const deleteResult = await booksCollection.deleteOne({ title: "The Hobbit" });  
   console.log('Delete result:', deleteResult.deletedCount === 1 ? 'Success' : 'Failed');  
  
   // Verify the changes  
   const finalBooks = await booksCollection.find().toArray();  
   console.log('Final state of books collection:', finalBooks);  
  
  } finally {  
   // Close the connection  
   await client.close();  
   console.log('Connection closed');  
  }  
}  
  
runQueries().catch(console.error);
