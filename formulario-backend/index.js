require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// 📁 Pasta onde está o formulário (docs)
const docsPath = path.join(__dirname, '../docs');
app.use(express.static(docsPath));

// 📁 Pasta de uploads
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}
app.use('/uploads', express.static(uploadPath));

// 🧭 Rota principal: serve o formulário
app.get('/', (req, res) => {
  res.sendFile(path.join(docsPath, 'index.html'));
});

// 🎒 Upload de arquivos com multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 🧾 Modelo do Funcionário
const funcionarioSchema = new mongoose.Schema({
  nome: String,
  situacao: { type: String, default: 'Aprovar' },
  contrato: { type: String, default: 'Verificar' },
  dataAdmissao: { type: Date, default: new Date('1900-01-01T00:00:00.000+00:00') },
  telefone: String,
  email: String,
  endereco: String,
  complemento: String,
  bairro: String,
  municipio: String,
  cep: String,
  banco: String,
  agencia: String,
  conta: String,
  pix: String,
  dataNascimento: Date,
  cpf: String,
  rg: String,
  estadoCivil: String,
  filhos: Number,
  cnh: String,
  categoria: String,
  dataValidadeCNH: Date,
  nomeFamiliar: String,
  contatoFamiliar: String,
  dataUltimoServicoPrestado: { type: Date, default: new Date('1900-01-01T00:00:00.000Z') },
  indicado: String,
  observacao: String,
  cnhDocumento: String,
  comprovanteResidencia: String,
  nadaConsta: String,
  comprovanteMei: String
}, { timestamps: true });

const Funcionario = mongoose.model('Funcionario', funcionarioSchema);

// 🔌 Conexão MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado ao MongoDB Atlas");
  })
  .catch(err => console.error("❌ Erro ao conectar:", err));

// 📥 POST /api/funcionarios
app.post('/api/funcionarios', upload.fields([
  { name: 'cnhArquivo', maxCount: 1 },
  { name: 'comprovanteResidencia', maxCount: 1 },
  { name: 'nadaConstaArquivo', maxCount: 1 },
  { name: 'meiArquivo', maxCount: 1 }
]), async (req, res) => {
  try {
    const body = req.body;
    const arquivos = req.files;

    const novoFuncionario = new Funcionario({
      ...body,
      telefone: body.telefone?.replace(/\D/g, ''),
      contatoFamiliar: body.contatoFamiliar?.replace(/\D/g, ''),
      cnhDocumento: arquivos?.cnhArquivo?.[0]?.filename || '',
      comprovanteResidencia: arquivos?.comprovanteResidencia?.[0]?.filename || '',
      nadaConsta: arquivos?.nadaConstaArquivo?.[0]?.filename || '',
      comprovanteMei: arquivos?.meiArquivo?.[0]?.filename || ''
    });

    await novoFuncionario.save();
    res.status(201).json(novoFuncionario);
  } catch (err) {
    console.error("❌ Erro ao salvar:", err);
    res.status(500).json({ erro: err.message });
  }
});

// 📤 GET /api/funcionarios
app.get('/api/funcionarios', async (req, res) => {
  try {
    const funcionarios = await Funcionario.find().sort({ nome: 1 });
    res.json(funcionarios);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar funcionários' });
  }
});

// 🚀 Inicialização do servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
});
