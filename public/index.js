const API_FUNCIONARIOS = 'http://localhost:10000/api/funcionarios';

document.getElementById('formFuncionario').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const dados = {};
    formData.forEach((v, k) => dados[k] = v);
  
    dados.dataAdmissao = new Date(dados.dataAdmissao).toISOString();
    dados.dataNascimento = new Date(dados.dataNascimento).toISOString();
    dados.dataValidadeCNH = new Date(dados.dataValidadeCNH).toISOString();
    dados.dataUltimoServicoPrestado = "1900-01-01T00:00:00.000Z";
    dados.createdAt = new Date().toISOString();
    dados.updatedAt = new Date().toISOString();
    dados.__v = 0;
  
    try {
      const res = await fetch('API_FUNCIONARIOS', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      const resultado = await res.json();
  
      if (res.ok) {
        console.log("✅ Dados gravados no MongoDB:", resultado);
        alert('Dados enviados com sucesso!');
        form.reset();
      } else {
        console.error("❌ Erro ao gravar:", resultado);
        alert('Erro ao gravar os dados!');
      }
    } catch (error) {
      console.error("❌ Erro de rede:", error);
      alert('Erro de conexão com o servidor.');
    }
  });
  