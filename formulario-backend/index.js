const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

const CadastroSchema = new mongoose.Schema({
  nome: String,
  email: String,
  telefone: String,
  cep: String,
  endereco: String,
  cidade: String,
  estado: String
});

const Cadastro = mongoose.model('Cadastro', CadastroSchema);

app.post('/api/cadastro', async (req, res) => {
  try {
    const novoCadastro = new Cadastro(req.body);
    await novoCadastro.save();
    res.status(200).json({ message: 'Cadastro salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar cadastro:', error);
    res.status(500).json({ error: 'Erro ao salvar cadastro.' });
  }
});

app.get('/', (req, res) => {
  res.send('API do Formulário GrupoLocar ativa!');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
