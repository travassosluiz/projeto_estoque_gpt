// script.js

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
    const fb = document.getElementById('feedback-nota'); fb.style.display = 'none';
    body.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
    try {
        if (!cacheSuppliers) {
            cacheSuppliers = [];
            const resS = await fetch(`${API_BASE}/suppliers?skip=0&limit=${PAGE_SIZE*10}`);
            cacheSuppliers = await resS.json();
        }
        if (!cachePurchaseItems) {
            const resIt = await fetch(`${API_BASE}/purchase_items`);
            cachePurchaseItems = await resIt.json();
        }
        const res = await fetch(`${API_BASE}/purchase_invoices`);
        const notas = await res.json();
        body.innerHTML = '';
        notas.forEach(n => {
            const sup = cacheSuppliers.find(s => s.id === n.supplier_id) || {};
            body.innerHTML += `<tr>` +
                `<td>${n.id}</td>` +
                `<td>${sup.name||'?'}</td>` +
                `<td>${new Date(n.date).toLocaleDateString('pt-BR')}</td>` +
                `<td>R$ ${n.total.toFixed(2)}</td>` +
                `<td><button onclick="toggleNota(${n.id})">🔍</button></td>` +
                `</tr>` +
                `<tr id="nota-${n.id}" class="hidden"><td colspan="5"><div id="itens-${n.id}">Carregando itens...</div></td></tr>`;
        });
    } catch (e) {
        fb.textContent = 'Erro nas notas'; fb.className = 'feedback error'; fb.style.display = 'block';
    }
}

async function toggleNota(id) {
    const row = document.getElementById(`nota-${id}`);
    if (row.classList.contains('hidden')) {
        row.classList.remove('hidden');
        const div = document.getElementById(`itens-${id}`);
        const itens = cachePurchaseItems.filter(pi => pi.purchase_invoice_id === id);
        div.innerHTML = "<table style='width:100%'><thead><tr><th>Produto</th><th>Qtd</th><th>Preço Uni.</th></tr></thead><tbody>" +
            itens.map(i => {
                const p = cacheProducts.find(x => x.id === i.product_id) || {};
                return `<tr><td>${p.name||'?'}<\/td><td>${i.quantity}<\/td><td>R$ ${i.unit_price.toFixed(2)}<\/td><\/tr>`;
            }).join('') +
            "</tbody></table>";
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
