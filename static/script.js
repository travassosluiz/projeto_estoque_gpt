// /static/script.js

const API_BASE = "http://192.168.18.109:8000";
const PAGE_SIZE = 20;
let clientPage = 1, loadingClients = false, clientsEnd = false;
let productPage = 1, loadingProducts = false, productsEnd = false;
let supplierPage = 1, loadingSuppliers = false, suppliersEnd = false;
let cacheProducts = null, cacheSuppliers = null, cachePurchaseItems = null;
let currentEntity = null, editId = null, deleteEntity = null, deleteId = null;

// Alterna visibilidade e carrega seção
function toggleSection(id) {
    const sec = document.getElementById(id);
    sec.style.display = sec.style.display === 'block' ? 'none' : 'block';
    if (sec.style.display === 'block') loadSection(id);
}

// Força atualização, limpa cache e reinicia paginação
function refreshSection(section) {
    switch(section) {
        case 'clientes':
            clientPage = 1; clientsEnd = false;
            document.getElementById('body-cliente').innerHTML = '';
            loadClientsPage();
            break;
        case 'produtos':
            productPage = 1; productsEnd = false;
            document.getElementById('body-produto').innerHTML = '';
            loadProductsPage();
            break;
        case 'fornecedores':
            supplierPage = 1; suppliersEnd = false;
            document.getElementById('body-fornecedor').innerHTML = '';
            loadSuppliersPage();
            break;
        case 'inventario':
            cacheProducts = null;
            document.getElementById('body-inventario').innerHTML = '';
            loadInventario();
            break;
        case 'notasCompra':
            cacheSuppliers = null;
            cachePurchaseItems = null;
            document.getElementById('body-nota').innerHTML = '';
            loadNotas();
            break;
    }
}

// Carrega primeira página de cada seção
function loadSection(entity) {
    if (entity === 'clientes') loadClientsPage();
    if (entity === 'produtos') loadProductsPage();
    if (entity === 'fornecedores') loadSuppliersPage();
    if (entity === 'inventario') loadInventario();
    if (entity === 'notasCompra') loadNotas();
}

// Configura infinite scroll após DOM carregado
document.addEventListener('DOMContentLoaded', () => {
    ['clientes', 'produtos', 'fornecedores'].forEach(id => {
        const sec = document.getElementById(id);
        sec.addEventListener('scroll', () => {
            if (sec.scrollTop + sec.clientHeight >= sec.scrollHeight - 10) {
                if (id === 'clientes') loadClientsPage();
                if (id === 'produtos') loadProductsPage();
                if (id === 'fornecedores') loadSuppliersPage();
            }
        });
    });
});

// ---------- Paginação e carregamento ----------
async function loadClientsPage() {
    if (loadingClients || clientsEnd) return;
    loadingClients = true;
    const body = document.getElementById('body-cliente');
    if (clientPage === 1) body.innerHTML = '<tr><td colspan="7">Carregando...</td></tr>';
    try {
        const res = await fetch(`${API_BASE}/clients?skip=${(clientPage-1)*PAGE_SIZE}&limit=${PAGE_SIZE}`);
        const data = await res.json();
        if (clientPage === 1) body.innerHTML = '';
        data.forEach(c => {
            body.innerHTML += `<tr>` +
                `<td>${c.id}</td>` +
                `<td>${c.name}</td>` +
                `<td>${c.document}</td>` +
                `<td>${c.email}</td>` +
                `<td>${c.phone}</td>` +
                `<td>${c.active?'Sim':'Não'}</td>` +
                `<td><button onclick="openModal('cliente',${c.id})">✏️</button><button onclick="openConfirm('cliente',${c.id})">🗑️</button></td>` +
                `</tr>`;
        });
        if (data.length < PAGE_SIZE) clientsEnd = true;
        clientPage++;
    } catch (e) {
        const fb = document.getElementById('feedback-cliente');
        fb.textContent = 'Erro ao carregar clientes';
        fb.className = 'feedback error';
        fb.style.display = 'block';
    }
    loadingClients = false;
}

async function loadProductsPage() {
    if (loadingProducts || productsEnd) return;
    loadingProducts = true;
    const body = document.getElementById('body-produto');
    if (productPage === 1) body.innerHTML = '<tr><td colspan="7">Carregando...</td></tr>';
    try {
        const res = await fetch(`${API_BASE}/products?skip=${(productPage-1)*PAGE_SIZE}&limit=${PAGE_SIZE}`);
        const data = await res.json();
        if (productPage === 1) body.innerHTML = '';
        cacheProducts = cacheProducts || [];
        data.forEach(p => {
            cacheProducts.push(p);
            body.innerHTML += `<tr>` +
                `<td>${p.id}</td>` +
                `<td>${p.name}</td>` +
                `<td>${p.description}</td>` +
                `<td>R$ ${p.price.toFixed(2)}</td>` +
                `<td>${p.sku}</td>` +
                `<td>${p.active?'Sim':'Não'}</td>` +
                `<td><button onclick="openModal('produto',${p.id})">✏️</button><button onclick="openConfirm('produto',${p.id})">🗑️</button></td>` +
                `</tr>`;
        });
        if (data.length < PAGE_SIZE) productsEnd = true;
        productPage++;
    } catch (e) {
        const fb = document.getElementById('feedback-produto');
        fb.textContent = 'Erro ao carregar produtos';
        fb.className = 'feedback error';
        fb.style.display = 'block';
    }
    loadingProducts = false;
}

async function loadSuppliersPage() {
    if (loadingSuppliers || suppliersEnd) return;
    loadingSuppliers = true;
    const body = document.getElementById('body-fornecedor');
    if (supplierPage === 1) body.innerHTML = '<tr><td colspan="7">Carregando...</td></tr>';
    try {
        const res = await fetch(`${API_BASE}/suppliers?skip=${(supplierPage-1)*PAGE_SIZE}&limit=${PAGE_SIZE}`);
        const data = await res.json();
        if (supplierPage === 1) body.innerHTML = '';
        cacheSuppliers = cacheSuppliers || [];
        data.forEach(s => {
            cacheSuppliers.push(s);
            body.innerHTML += `<tr>` +
                `<td>${s.id}</td>` +
                `<td>${s.name}</td>` +
                `<td>${s.document}</td>` +
                `<td>${s.email}</td>` +
                `<td>${s.phone}</td>` +
                `<td>${s.active?'Sim':'Não'}</td>` +
                `<td><button onclick="openModal('fornecedor',${s.id})">✏️</button><button onclick="openConfirm('fornecedor',${s.id})">🗑️</button></td>` +
                `</tr>`;
        });
        if (data.length < PAGE_SIZE) suppliersEnd = true;
        supplierPage++;
    } catch (e) {
        const fb = document.getElementById('feedback-fornecedor');
        fb.textContent = 'Erro ao carregar fornecedores';
        fb.className = 'feedback error';
        fb.style.display = 'block';
    }
    loadingSuppliers = false;
}

// ---------- Inventário e Notas ----------
async function loadInventario() {
    const body = document.getElementById('body-inventario');
    const fb = document.getElementById('feedback-inventario'); fb.style.display = 'none';
    body.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
    try {
        if (!cacheProducts) {
            cacheProducts = [];
            const resP = await fetch(`${API_BASE}/products?skip=0&limit=${PAGE_SIZE*10}`);
            cacheProducts = await resP.json();
        }
        const res = await fetch(`${API_BASE}/inventories`);
        const items = await res.json();
        body.innerHTML = '';
        items.forEach(i => {
            const prod = cacheProducts.find(p => p.id === i.product_id) || {};
            body.innerHTML += `<tr>` +
                `<td>${i.id}</td>` +
                `<td>${prod.name||'?'}</td>` +
                `<td>${prod.sku||''}</td>` +
                `<td>R$ ${prod.price?.toFixed(2)||'0.00'}</td>` +
                `<td>${i.quantity}</td>` +
                `</tr>`;
        });
    } catch (e) {
        fb.textContent = 'Erro no inventário'; fb.className = 'feedback error'; fb.style.display = 'block';
    }
}

async function loadNotas() {
    const body = document.getElementById('body-nota');
    const fb   = document.getElementById('feedback-nota');
    fb.style.display = 'none';
    body.innerHTML   = '<tr><td colspan="5">Carregando...</td></tr>';

    try {
        // Carrega fornecedores em cache
        if (!cacheSuppliers) {
            const resS = await fetch(`${API_BASE}/suppliers?skip=0&limit=${PAGE_SIZE*10}`);
            cacheSuppliers = await resS.json();
        }
        // Carrega itens de compra em cache
        if (!cachePurchaseItems) {
            const resIt = await fetch(`${API_BASE}/purchase_items`);
            cachePurchaseItems = await resIt.json();
        }
        // Busca todas as notas
        const res   = await fetch(`${API_BASE}/purchase_invoices`);
        const notas = await res.json();

        body.innerHTML = '';
        notas.forEach(n => {
            const sup     = cacheSuppliers.find(s => s.id === n.supplier_id) || {};
            // Proteção contra campos indefinidos
            const rawDate = n.invoice_date ?? n.date;
            const date    = rawDate ? new Date(rawDate).toLocaleDateString('pt-BR') : '–';
            const rawTot  = n.total_amount ?? n.total;
            const total   = (typeof rawTot === 'number' ? rawTot : parseFloat(rawTot) || 0).toFixed(2);

            body.innerHTML += `
                <tr>
                    <td>${n.id}</td>
                    <td>${sup.name || '?'}</td>
                    <td>${date}</td>
                    <td>R$ ${total}</td>
                    <td>
                        <button onclick="toggleNota(${n.id})">🔍</button>
                        <button onclick="openNotaCompraModal(${n.id})">✏️</button>
                    </td>
                </tr>
                <tr id="nota-${n.id}" class="hidden">
                    <td colspan="5">
                        <div id="itens-${n.id}">Carregando itens...</div>
                    </td>
                </tr>`;
        });
    } catch (e) {
        console.error('Erro em loadNotas():', e);
        fb.textContent = 'Erro ao carregar notas';
        fb.className   = 'feedback error';
        fb.style.display = 'block';
    }
}

async function toggleNota(id) {
    const row = document.getElementById(`nota-${id}`);
    if (row.classList.contains('hidden')) {
        // primeiro carregamos products no cache, se ainda não tiver sido feito
        if (!cacheProducts) {
            const resP = await fetch(`${API_BASE}/products?skip=0&limit=${PAGE_SIZE*10}`);
            cacheProducts = await resP.json();
        }

        row.classList.remove('hidden');
        const div   = document.getElementById(`itens-${id}`);
        const itens = cachePurchaseItems.filter(pi => pi.purchase_invoice_id === id);

        div.innerHTML = `
            <table style="width:100%">
                <thead>
                    <tr><th>Produto</th><th>Qtd</th><th>Preço Uni.</th></tr>
                </thead>
                <tbody>
                    ${itens.map(i => {
                        // agora cacheProducts já está definido
                        const p = cacheProducts.find(x => x.id === i.product_id) || {};
                        return `<tr>
                            <td>${p.name||'?'}</td>
                            <td>${i.quantity}</td>
                            <td>R$ ${i.unit_price.toFixed(2)}</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>`;
    } else {
        row.classList.add('hidden');
    }
}


// ---------- CRUD Modais e Ações ----------
function openModal(entity, id = null) {
    currentEntity = entity; editId = id;
    const modal = document.getElementById('modal-entidade');
    const title = document.getElementById('titulo-modal');
    const form = document.getElementById('form-fields');
    form.innerHTML = '';
    switch(entity) {
        case 'cliente':
            title.textContent = id ? 'Editar Cliente' : 'Novo Cliente';
            form.innerHTML = '<input id="field-name" placeholder="Nome">' +
                             '<input id="field-document" placeholder="Documento">' +
                             '<input id="field-email" placeholder="Email">' +
                             '<input id="field-phone" placeholder="Telefone">' +
                             '<select id="field-active"><option value=true>Ativo</option><option value=false>Inativo</option></select>';
            if (id) fetch(`${API_BASE}/clients/${id}`).then(r => r.json()).then(d => {
                form.querySelector('#field-name').value = d.name;
                form.querySelector('#field-document').value = d.document;
                form.querySelector('#field-email').value = d.email;
                form.querySelector('#field-phone').value = d.phone;
                form.querySelector('#field-active').value = d.active;
            });
            break;
        case 'produto':
            title.textContent = id ? 'Editar Produto' : 'Novo Produto';
            form.innerHTML = '<input id="field-name" placeholder="Nome">' +
                             '<input id="field-description" placeholder="Descrição">' +
                             '<input type="number" step="0.01" id="field-price" placeholder="Preço">' +
                             '<input id="field-sku" placeholder="SKU">' +
                             '<select id="field-active"><option value=true>Ativo</option><option value=false>Inativo</option></select>';
            if (id) fetch(`${API_BASE}/products/${id}`).then(r => r.json()).then(d => {
                form.querySelector('#field-name').value = d.name;
                form.querySelector('#field-description').value = d.description;
                form.querySelector('#field-price').value = d.price;
                form.querySelector('#field-sku').value = d.sku;
                form.querySelector('#field-active').value = d.active;
            });
            break;
        case 'fornecedor':
            title.textContent = id ? 'Editar Fornecedor' : 'Novo Fornecedor';
            form.innerHTML = '<input id="field-name" placeholder="Nome">' +
                             '<input id="field-document" placeholder="Documento">' +
                             '<input id="field-email" placeholder="Email">' +
                             '<input id="field-phone" placeholder="Telefone">' +
                             '<select id="field-active"><option value=true>Ativo</option><option value=false>Inativo</option></select>';
            if (id) fetch(`${API_BASE}/suppliers/${id}`).then(r => r.json()).then(d => {
                form.querySelector('#field-name').value = d.name;
                form.querySelector('#field-document').value = d.document;
                form.querySelector('#field-email').value = d.email;
                form.querySelector('#field-phone').value = d.phone;
                form.querySelector('#field-active').value = d.active;
            });
            break;
    }
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-entidade').style.display = 'none';
}

async function saveEntity() {
    const form = document.getElementById('form-fields');
    const payload = {};
    ['name','document','email','phone','description','price','sku','active'].forEach(f => {
        const el = form.querySelector(`#field-${f}`);
        if (el) {
            payload[f] = el.type === 'number' ? parseFloat(el.value)
                : el.value === 'true' ? true
                : el.value === 'false' ? false
                : el.value;
        }
    });
    try {
        const ep = currentEntity === 'cliente' ? 'clients'
                 : currentEntity === 'produto' ? 'products'
                 : 'suppliers';
        const url = `${API_BASE}/${ep}/${editId || ''}`;
        const method = editId ? 'PUT' : 'POST';
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        closeModal();
        loadSection(currentEntity === 'cliente' ? 'clientes'
                   : currentEntity === 'produto' ? 'produtos'
                   : 'fornecedores');
        const fb = document.getElementById(`feedback-${currentEntity}`);
        fb.textContent = 'Salvo com sucesso'; fb.className = 'feedback success'; fb.style.display = 'block';
    } catch (e) {
        const fb = document.getElementById(`feedback-${currentEntity}`);
        fb.textContent = 'Erro ao salvar'; fb.className = 'feedback error'; fb.style.display = 'block';
    }
}

function openConfirm(entity, id) {
    deleteEntity = entity; deleteId = id;
    document.getElementById('modal-confirm').style.display = 'flex';
}

function closeConfirm() {
    document.getElementById('modal-confirm').style.display = 'none';
}

async function confirmDelete() {
    try {
        const ep = deleteEntity === 'cliente' ? 'clients'
                 : deleteEntity === 'produto' ? 'products'
                 : 'suppliers';
        await fetch(`${API_BASE}/${ep}/${deleteId}`, { method: 'DELETE' });
        closeConfirm();
        loadSection(deleteEntity === 'cliente' ? 'clientes'
                   : deleteEntity === 'produto' ? 'produtos'
                   : 'fornecedores');
        const fb = document.getElementById(`feedback-${deleteEntity}`);
        fb.textContent = 'Excluído com sucesso'; fb.className = 'feedback success'; fb.style.display = 'block';
    } catch (e) {
        const fb = document.getElementById(`feedback-${deleteEntity}`);
        fb.textContent = 'Erro ao excluir'; fb.className = 'feedback error'; fb.style.display = 'block';
    }
}

async function openNotaCompraModal(id = null) {
    editId = id;
    const modal = document.getElementById('modal-entidade');
    const title = document.getElementById('titulo-modal');
    const form  = document.getElementById('form-fields');
  
    // Título
    title.textContent = id ? 'Editar Nota de Compra' : 'Nova Nota de Compra';
  
    // HTML estrutural (já com tbody vazio para os <tr>)
    form.innerHTML = `
    <div class="nota-form">
      <div class="nota-header">
        <div class="field-group">
          <label for="nota-supplier">Fornecedor</label>
          <select id="nota-supplier">
            ${cacheSuppliers.map(s =>
              `<option value="${s.id}">${s.name}</option>`
            ).join('')}
          </select>
        </div>
        <div class="field-group">
          <label for="nota-date">Data</label>
          <input type="date" id="nota-date">
        </div>
        <div class="field-group">
          <label for="nota-total">Total (R$)</label>
          <input type="number" step="0.01" id="nota-total" placeholder="0.00">
        </div>
      </div>
  
      <div class="itens-container">
        <table>
          <thead>
            <tr>
              <th>Produto</th><th>Qtd</th><th>Preço Uni.</th><th>Ações</th>
            </tr>
          </thead>
          <tbody id="nota-itens"></tbody>
        </table>
      </div>
  
      <div class="nota-actions">
        <button type="button" onclick="addItemNota()">+ Item</button>
        <button type="button" onclick="saveNotaCompra()">Salvar</button>
      </div>
    </div>`;
  
  
    if (id) {
      // 1) Garante cache de itens
      if (!cachePurchaseItems) {
        const resIt = await fetch(`${API_BASE}/purchase_items`);
        cachePurchaseItems = await resIt.json();
      }
      // 2) Busca a nota exata
      const resp = await fetch(`${API_BASE}/purchase_invoices/${id}`);
      const n    = await resp.json();
  
      // 3) Preenche os campos de header
      const rawDate = n.invoice_date ?? n.date;
      form.querySelector('#nota-date').value = rawDate ? rawDate.split('T')[0] : '';
      form.querySelector('#nota-supplier').value = n.supplier_id;
      form.querySelector('#nota-total').value    = (n.total_amount ?? n.total) || 0;
  
      // 4) Preenche a lista de itens
      const itens = cachePurchaseItems.filter(pi => pi.purchase_invoice_id === id);
      itens.forEach(i => {
        addItemNota(i.product_id, i.quantity, i.unit_price);
      });
    }
  
    modal.style.display = 'flex';
  }
  

function addItemNota(prodId = '', qtd = '', preco = '') {
    const tbody = document.getElementById('nota-itens');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <select class="item-produto">
          ${cacheProducts.map(p =>
            `<option value="${p.id}" ${p.id==prodId?'selected':''}>${p.name}</option>`
          ).join('')}
        </select>
      </td>
      <td><input type="number" class="item-qtd" step="1" value="${qtd}"></td>
      <td><input type="number" class="item-preco" step="0.01" value="${preco}"></td>
      <td>
        <button type="button" onclick="removeItemNota(event)">🗑️</button>
      </td>`;
    tbody.appendChild(tr);
  }
  
  // Função para remover a linha
  function removeItemNota(ev) {
    const tr = ev.target.closest('tr');
    tr.remove();
  }
  

async function saveNotaCompra() {
    const supplier_id = parseInt(document.getElementById('nota-supplier').value);
    const invoice_date = document.getElementById('nota-date').value;
    const total_amount = parseFloat(document.getElementById('nota-total').value);
    const method = editId ? 'PUT' : 'POST';
    const notaUrl = `${API_BASE}/purchase_invoices/${editId || ''}`;

    try {
        const res = await fetch(notaUrl, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ supplier_id, invoice_date, total_amount })
        });
        const nota = await res.json();
        const notaId = nota.id || editId;

        const items = [...document.querySelectorAll('#nota-itens .item')].map(div => {
            return {
                invoice_id: notaId,
                product_id: parseInt(div.querySelector('.item-produto').value),
                quantity: parseInt(div.querySelector('.item-qtd').value),
                unit_price: parseFloat(div.querySelector('.item-preco').value)
            }
        });

        for (let item of items) {
            await fetch(`${API_BASE}/purchase_items/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        }

        closeModal();
        refreshSection('notasCompra');
    } catch (e) {
        alert('Erro ao salvar nota');
    }
}
