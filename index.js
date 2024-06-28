import express from 'express';
import pool from './config/db.js';

const app = express();

// Define your routes here
app.get('/productos', async (req, res) => {

    const sql = `SELECT productos.nombre, productos.precio, productos.descripcion, productos.stock, 
                categorias.nombre AS categoria, promos.promos AS banco, promos.descuento, 
                cuotas.cuotas, cuotas.interes
                FROM productos 
                JOIN categorias ON productos.fk_categoria = categorias.id_categoria
                JOIN promos ON productos.fk_promos = promos.id_promos
                JOIN cuotas ON productos.fk_cuotas = cuotas.id_cuotas`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql);
        connection.release();
        res.json(rows)
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM productos WHERE id = ?';

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, id);
        connection.release();
        if (rows.length === 0) {
            res.status(404).send('Item not found');
        } else {
            res.json(rows[0])
        }

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

app.post('/productos', async (req, res) => {
    const producto = req.body

    const sql = 'INSERT INTO productos SET ?';

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, producto);
        connection.release();
        res.send(`Producto creado correctamente, ID: ${rows.insertId}`);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

app.put('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const producto = req.body
    const sql = 'UPDATE productos SET ? WHERE id = ?';

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [producto, id]);
        connection.release();
        if (rows.affectedRows === 0) {
            res.status(404).send('Producto NO encontrado');
        } else {
            res.send(`Producto actualizado correctamente, ID: ${id}`);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

app.delete('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM productos WHERE id = ?';

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, id);
        connection.release();
        if (rows.affectedRows === 0) {
            res.status(404).send('Producto NO encontrado');
        } else {
            res.send(`Producto eliminado correctamente, ID: ${itemId}`);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});