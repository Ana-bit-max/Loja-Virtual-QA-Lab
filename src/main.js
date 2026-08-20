const products = [
  { id: 1, name: 'Fone AirSound', category: 'Tecnologia', price: 189.9, icon: '🎧', description: 'Som nítido para acompanhar seu ritmo.' },
  { id: 2, name: 'Garrafa Flow', category: 'Bem-estar', price: 64.9, icon: '💧', description: 'Hidratação prática em qualquer lugar.' },
  { id: 3, name: 'Mochila Urban', category: 'Acessórios', price: 249.9, icon: '🎒', description: 'Espaço e conforto para a rotina.' },
  { id: 4, name: 'Caderno Pontilhado', category: 'Papelaria', price: 39.9, icon: '📓', description: 'Ideias organizadas página por página.' },
  { id: 5, name: 'Café Sunrise', category: 'Casa', price: 42.5, icon: '☕', description: 'Torra especial para começar bem.' },
  { id: 6, name: 'Luminária Halo', category: 'Casa', price: 129.9, icon: '💡', description: 'Luz suave para seu espaço.' }
];

const state = { cart: [], search: '', authMode: 'login' };
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function getCartCount() { return state.cart.reduce((total, item) => total + item.quantity, 0); }
function getCartTotal() { return state.cart.reduce((total, item) => total + item.price * item.quantity, 0); }
function notify(message, type = 'success') {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.className = `toast toast--${type} toast--visible`;
  window.setTimeout(() => { toast.className = 'toast'; }, 2800);
}
function renderProducts() {
  const visibleProducts = products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(state.search.toLowerCase()));
  document.querySelector('#product-grid').innerHTML = visibleProducts.length
    ? visibleProducts.map((product) => `<article class="product-card" data-testid="product-card-${product.id}">
        <div class="product-visual">${product.icon}<span>${product.category}</span></div>
        <div class="product-body"><h3>${product.name}</h3><p>${product.description}</p><strong>${currency.format(product.price)}</strong>
        <button class="button button--dark" data-add-product="${product.id}" data-testid="add-product-${product.id}">Adicionar ao carrinho</button></div>
      </article>`).join('')
    : '<p class="empty-state">Nenhum produto encontrado. Tente outro termo.</p>';
}
function renderCart() {
  const cart = document.querySelector('#cart-items');
  document.querySelector('#cart-count').textContent = getCartCount();
  document.querySelector('#cart-total').textContent = currency.format(getCartTotal());
  cart.innerHTML = state.cart.length
    ? state.cart.map((item) => `<div class="cart-item" data-testid="cart-item-${item.id}"><div class="cart-item__icon">${item.icon}</div><div class="cart-item__info"><strong>${item.name}</strong><span>${currency.format(item.price)}</span><div class="quantity"><button data-decrease="${item.id}" aria-label="Diminuir quantidade">−</button><output>${item.quantity}</output><button data-increase="${item.id}" aria-label="Aumentar quantidade">+</button></div></div><button class="remove-button" data-remove="${item.id}" aria-label="Remover ${item.name}">Remover</button></div>`).join('')
    : '<p class="empty-state">Seu carrinho está vazio.</p>';
}
function addToCart(id) {
  const product = products.find((item) => item.id === id);
  const existing = state.cart.find((item) => item.id === id);
  if (existing) existing.quantity += 1;
  else state.cart.push({ ...product, quantity: 1 });
  renderCart();
  notify(`${product.name} foi adicionado ao carrinho.`);
}
function showSection(id) { document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

const app = document.querySelector('#app');
app.innerHTML = `<div class="page-shell">
  <header class="site-header"><a class="brand" href="#inicio" data-nav="inicio"><span class="brand-mark">Q</span><span>Loja Virtual <em>QA Lab</em></span></a><nav><a href="#produtos" data-nav="produtos">Produtos</a><a href="#acesso" data-nav="acesso">Minha conta</a><a class="cart-link" href="#carrinho" data-nav="carrinho">Carrinho <span id="cart-count">0</span></a></nav></header>
  <main>
    <section class="hero" id="inicio"><div class="hero-copy"><p class="eyebrow">AMBIENTE DE TESTES • VERSÃO 1.0</p><h1>Compras simples.<br /><span>Testes melhores.</span></h1><p class="hero-text">Uma loja pequena e honesta para você praticar qualidade de ponta a ponta.</p><button class="button button--lime" data-scroll="produtos">Explorar produtos <span>↗</span></button></div><div class="hero-art"><div class="orb orb--lime"></div><div class="orb orb--pink"></div><div class="floating-box floating-box--top"><span>✓</span><div><strong>Fluxo validado</strong><small>checkout pronto</small></div></div><div class="floating-box floating-box--bottom">🛒 <strong>6 produtos</strong></div><div class="hero-sticker">QA<br /><small>LAB</small></div></div></section>
    <section class="section products-section" id="produtos"><div class="section-heading"><div><p class="eyebrow">CATÁLOGO</p><h2>Escolha seu próximo teste</h2></div><label class="search-box"><span>⌕</span><input id="search-input" type="search" placeholder="Buscar produto..." aria-label="Buscar produto" /></label></div><div class="product-grid" id="product-grid"></div></section>
    <section class="workspace-grid section" id="carrinho"><div class="panel cart-panel"><div class="panel-heading"><div><p class="eyebrow">RESUMO DO PEDIDO</p><h2>Seu carrinho</h2></div><span class="panel-count" id="cart-count">0</span></div><div id="cart-items"></div><div class="cart-footer"><span>Total</span><strong id="cart-total">R$ 0,00</strong><button class="button button--lime button--full" id="checkout-button">Ir para checkout</button></div></div><div class="panel checkout-panel" id="checkout"><p class="eyebrow">FINALIZAÇÃO</p><h2>Checkout</h2><form id="checkout-form"><label>Nome completo<input name="name" type="text" placeholder="Ana Souza" required /></label><label>E-mail<input name="email" type="email" placeholder="ana@email.com" required /></label><label>Número do cartão<input name="card" inputmode="numeric" minlength="16" placeholder="0000 0000 0000 0000" required /></label><button class="button button--dark button--full" type="submit">Finalizar compra</button><p class="form-message" id="checkout-message" role="alert"></p></form></div></section>
    <section class="section access-section" id="acesso"><div class="access-intro"><p class="eyebrow">ÁREA DO CLIENTE</p><h2>Entre para continuar sua jornada.</h2><p>Use esta área para exercitar cenários de sucesso, validação e mensagens de erro.</p></div><div class="panel auth-panel"><div class="auth-tabs"><button class="auth-tab is-active" data-auth="login">Entrar</button><button class="auth-tab" data-auth="register">Criar conta</button></div><form id="auth-form"></form></div></section>
  </main><footer><span>Loja Virtual <strong>QA Lab</strong></span><span>Feita para testar com curiosidade.</span></footer><div id="toast" class="toast" role="status"></div></div>`;

function renderAuth() {
  const isLogin = state.authMode === 'login';
  document.querySelector('#auth-form').innerHTML = isLogin ? `<label>E-mail<input name="email" type="email" placeholder="voce@email.com" required /></label><label>Senha<input name="password" type="password" placeholder="••••••••" minlength="6" required /></label><button class="button button--dark button--full" type="submit">Entrar na conta</button><p class="form-message" id="auth-message" role="alert"></p>` : `<label>Nome completo<input name="name" type="text" placeholder="Seu nome" required /></label><label>E-mail<input name="email" type="email" placeholder="voce@email.com" required /></label><label>Senha<input name="password" type="password" placeholder="Mínimo de 6 caracteres" minlength="6" required /></label><button class="button button--dark button--full" type="submit">Criar minha conta</button><p class="form-message" id="auth-message" role="alert"></p>`;
  document.querySelectorAll('[data-auth]').forEach((button) => button.classList.toggle('is-active', button.dataset.auth === state.authMode));
}

renderProducts(); renderCart(); renderAuth();
document.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add-product]');
  if (addButton) addToCart(Number(addButton.dataset.addProduct));
  const increase = event.target.closest('[data-increase]');
  if (increase) { state.cart.find((item) => item.id === Number(increase.dataset.increase)).quantity += 1; renderCart(); }
  const decrease = event.target.closest('[data-decrease]');
  if (decrease) { const item = state.cart.find((entry) => entry.id === Number(decrease.dataset.decrease)); item.quantity -= 1; if (item.quantity <= 0) state.cart = state.cart.filter((entry) => entry.id !== item.id); renderCart(); }
  const remove = event.target.closest('[data-remove]');
  if (remove) { state.cart = state.cart.filter((item) => item.id !== Number(remove.dataset.remove)); renderCart(); notify('Produto removido do carrinho.', 'error'); }
  const authTab = event.target.closest('[data-auth]');
  if (authTab) { state.authMode = authTab.dataset.auth; renderAuth(); }
  const scrollButton = event.target.closest('[data-scroll]');
  if (scrollButton) showSection(`#${scrollButton.dataset.scroll}`);
});
document.querySelector('#search-input').addEventListener('input', (event) => { state.search = event.target.value; renderProducts(); });
document.querySelector('#checkout-button').addEventListener('click', () => showSection('#checkout'));
document.querySelector('#checkout-form').addEventListener('submit', (event) => { event.preventDefault(); const message = document.querySelector('#checkout-message'); if (!state.cart.length) { message.textContent = 'Adicione pelo menos um produto antes de finalizar.'; message.className = 'form-message form-message--error'; return; } message.textContent = 'Pedido realizado com sucesso!'; message.className = 'form-message form-message--success'; event.target.reset(); state.cart = []; renderCart(); });
document.addEventListener('submit', (event) => { if (event.target.id !== 'auth-form') return; event.preventDefault(); const message = document.querySelector('#auth-message'); message.textContent = state.authMode === 'login' ? 'Login realizado com sucesso!' : 'Cadastro realizado com sucesso!'; message.className = 'form-message form-message--success'; event.target.reset(); });
