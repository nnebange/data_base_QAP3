const express = require('express');  
const { Pool } = require('pg');  
const app = express();  
const PORT = 3000;  
  
app.use(express.json());  
  
// PostgreSQL connection  
const pool = new Pool({  
   user: 'postgres',  
   host: 'localhost',  
   database: 'QAP3',  
   password: '1234',  
   port: 5432,  
});  
  
// Function to create the tasks table if it doesn't exist  
async function createTasksTable() {  
   const client = await pool.connect();  
   try {  
      await client.query(`  
        CREATE TABLE IF NOT EXISTS tasks (  
           id SERIAL PRIMARY KEY,  
           description TEXT NOT NULL,  
           status TEXT NOT NULL  
        )  
      `);  
      console.log('Tasks table created or already exists');  
   } catch (err) {  
      console.error('Error creating tasks table', err);  
   } finally {  
      client.release();  
   }  
}  
  
// Call the function to create the table  
createTasksTable();  
  
// GET /tasks - Get all tasks  
app.get('/tasks', async (req, res) => {  
   try {  
      const result = await pool.query('SELECT * FROM tasks');  
      res.json(result.rows);  
   } catch (err) {  
      console.error(err);  
      res.status(500).json({ error: 'Internal server error' });  
   }  
});  
  
// POST /tasks - Add a new task  
app.post('/tasks', async (request, response) => {  
   const { description, status } = request.body;  
   if (!description || !status) {  
      return response.status(400).json({ error: 'Description and status are required' });  
   }  
  
   try {  
      const result = await pool.query(  
        'INSERT INTO tasks (description, status) VALUES ($1, $2) RETURNING *',  
        [description, status]  
      );  
      response.status(201).json(result.rows[0]);  
   } catch (err) {  
      console.error(err);  
      response.status(500).json({ error: 'Internal server error' });  
   }  
});  
  
// PUT /tasks/:id - Update a task's status  
app.put('/tasks/:id', async (request, response) => {  
   const taskId = parseInt(request.params.id, 10);  
   const { status } = request.body;  
  
   try {  
      const result = await pool.query(  
        'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',  
        [status, taskId]  
      );  
      if (result.rows.length === 0) {  
        return response.status(404).json({ error: 'Task not found' });  
      }  
      response.json(result.rows[0]);  
   } catch (err) {  
      console.error(err);  
      response.status(500).json({ error: 'Internal server error' });  
   }  
});  
  
// DELETE /tasks/:id - Delete a task  
app.delete('/tasks/:id', async (request, response) => {  
   const taskId = parseInt(request.params.id, 10);  
  
   try {  
      const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);  
      if (result.rows.length === 0) {  
        return response.status(404).json({ error: 'Task not found' });  
      }  
      response.json({ message: 'Task deleted successfully' });  
   } catch (err) {  
      console.error(err);  
      response.status(500).json({ error: 'Internal server error' });  
   }  
});  
  
app.listen(PORT, () => {  
   console.log(`Server is running on http://localhost:${PORT}`);  
});
