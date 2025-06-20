const API_FUNCIONARIOS = 'http://localhost:10000/api/funcionarios';
const UPLOADS_URL = 'http://localhost:10000/uploads';

document.getElementById('formFuncionario')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  formData.append("dataUltimoServicoPrestado", "1900-01-01T00:00:00.000Z");
  formData.append("createdAt", new Date().toISOString());
  formData.append("updatedAt", new Date().toISOString());
  formData.append("__v", 0);

  try {
    const res = await fetch(API_FUNCIONARIOS, {
      method: 'POST',
      body: formData
    });
    const resultado = await res.json();

    if (res.ok) {
      alert("✅ Funcionário salvo com sucesso!");
      form.reset();
    } else {
      alert("❌ Erro: " + resultado.erro);
      console.error(resultado);
    }
  } catch (error) {
    console.error("❌ Erro de rede:", error);
    alert("Erro ao conectar com o servidor.");
  }
});

async function carregarFuncionarios() {
  try {
    const res = await fetch(API_FUNCIONARIOS);
    const funcionarios = await res.json();

    if (!Array.isArray(funcionarios)) {
      throw new Error('Resposta inesperada');
    }

    let html = `
      <h2>Funcionários Cadastrados</h2>
      <table border="1" cellpadding="5" cellspacing="0" style="font-size: 12px;">
        <thead>
          <tr>
            <th>Nome</th><th>Situação</th><th>Contrato</th><th>Data Admissão</th><th>Telefone</th>
            <th>Email</th><th>Endereço</th><th>Complemento</th><th>Bairro</th><th>Município</th>
            <th>CEP</th><th>Banco</th><th>Agência</th><th>Conta</th><th>PIX</th>
            <th>Nascimento</th><th>CPF</th><th>RG</th><th>Estado Civil</th><th>Filhos</th>
            <th>CNH</th><th>Categoria</th><th>Validade CNH</th><th>Familiar</th><th>Contato Familiar</th>
            <th>Data Último Serviço</th><th>Indicado</th><th>Observação</th>
            <th>CNH Doc</th><th>Comprovante Residência</th><th>Nada Consta</th><th>Comprovante MEI</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (const f of funcionarios) {
      html += `
        <tr>
          <td>${f.nome || ''}</td>
          <td>${f.situacao || ''}</td>
          <td>${f.contrato || ''}</td>
          <td>${f.dataAdmissao?.substring(0,10) || ''}</td>
          <td>${f.telefone || ''}</td>
          <td>${f.email || ''}</td>
          <td>${f.endereco || ''}</td>
          <td>${f.complemento || ''}</td>
          <td>${f.bairro || ''}</td>
          <td>${f.municipio || ''}</td>
          <td>${f.cep || ''}</td>
          <td>${f.banco || ''}</td>
          <td>${f.agencia || ''}</td>
          <td>${f.conta || ''}</td>
          <td>${f.pix || ''}</td>
          <td>${f.dataNascimento?.substring(0,10) || ''}</td>
          <td>${f.cpf || ''}</td>
          <td>${f.rg || ''}</td>
          <td>${f.estadoCivil || ''}</td>
          <td>${f.filhos || ''}</td>
          <td>${f.cnh || ''}</td>
          <td>${f.categoria || ''}</td>
          <td>${f.dataValidadeCNH?.substring(0,10) || ''}</td>
          <td>${f.nomeFamiliar || ''}</td>
          <td>${f.contatoFamiliar || ''}</td>
          <td>${f.dataUltimoServicoPrestado?.substring(0,10) || ''}</td>
          <td>${f.indicado || ''}</td>
          <td>${f.observacao || ''}</td>
          <td>${f.cnhDocumento ? `<a href="${UPLOADS_URL}/${f.cnhDocumento}" target="_blank">Ver</a>` : ''}</td>
          <td>${f.comprovanteResidencia ? `<a href="${UPLOADS_URL}/${f.comprovanteResidencia}" target="_blank">Ver</a>` : ''}</td>
          <td>${f.nadaConsta ? `<a href="${UPLOADS_URL}/${f.nadaConsta}" target="_blank">Ver</a>` : ''}</td>
          <td>${f.comprovanteMei ? `<a href="${UPLOADS_URL}/${f.comprovanteMei}" target="_blank">Ver</a>` : ''}</td>
        </tr>
      `;
    }

    html += '</tbody></table>';
    document.getElementById('listaFuncionarios').innerHTML = html;

  } catch (err) {
    console.error("Erro ao carregar funcionários:", err);
    alert("Erro ao buscar os dados dos funcionários.");
  }

}
