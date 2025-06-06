import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, inicializarTabela } from './db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

await inicializarTabela();

app.post('/api/registrar-escolha', async (req, res) => {
  const { escolha } = req.body;
  if (!['marido', 'esposa'].includes(escolha)) {
    return res.status(400).json({ error: 'Opção inválida' });
  }

  try {
    await pool.query(
      `INSERT INTO escolhas (opcao, quantidade) 
       VALUES ($1, 1)
       ON CONFLICT (opcao) 
       DO UPDATE SET quantidade = escolhas.quantidade + 1`,
      [escolha]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.get('/api/contagens', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM escolhas');
    const contagens = { marido: 0, esposa: 0 };
    result.rows.forEach(row => {
      contagens[row.opcao] = row.quantidade;
    });
    res.json(contagens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
