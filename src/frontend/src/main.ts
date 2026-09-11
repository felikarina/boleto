import { AuthApiAdapter } from './infrastructure/adapters/api/AuthApiAdapter';
import { TicketApiAdapter } from './infrastructure/adapters/api/TicketApiAdapter';
import { TicketService } from '../../shared/application/services/TicketService';
import { CreateTicketDTO, UpdateTicketDTO } from '../../shared/application/dto/TicketDTO';
import { TicketStatus } from '../../shared/domain/entities/Ticket';

// Initialiser les services
const authRepository = new AuthApiAdapter();
const ticketRepository = new TicketApiAdapter();
const ticketService = new TicketService(ticketRepository);

// Récupérer l'élément racine
const appElement = document.getElementById('app');
if (!appElement) throw new Error('Element #app not found');

// Fonction pour naviguer
const navigateTo = (path: string) => {
  window.history.pushState({}, '', path);
  handleRoute();
};

// Gestionnaire de route
const handleRoute = async () => {
  const path = window.location.pathname;
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  try {
    if (path === '/' || path === '') {
      renderHomePage();
    } else if (path === '/login') {
      renderLoginPage();
    } else if (path === '/signup') {
      renderSignupPage();
    } else if (path === '/tickets') {
      if (!isAuthenticated) { navigateTo('/login'); return; }
      await renderTicketsPage();
    } else {
      renderPage(`
        <main class="container">
          <div class="card">
            <h2>404</h2>
            <p>Page non trouvée.</p>
            <button class="btn" data-route="/">Accueil</button>
          </div>
        </main>
      `);
    }
  } catch (error) {
    console.error('Error:', error);
    renderPage(`
      <main class="container">
        <div class="card">
          <h2 class="alert-error">Erreur</h2>
          <p>${(error as Error).message}</p>
          <button class="btn" data-route="/">Accueil</button>
        </div>
      </main>
    `);
  }
};

// Rendre une page
const renderPage = (html: string) => {
  appElement.innerHTML = html;
};

appElement.addEventListener('click', (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-route], [data-action], [data-delete-ticket]');
  if (!target) return;

  event.preventDefault();

  const route = target.dataset.route;
  if (route) {
    navigateTo(route);
    return;
  }

  if (target.dataset.action === 'logout') {
    (window as any).logout();
    return;
  }

  const ticketId = target.dataset.deleteTicket;
  if (ticketId) {
    (window as any).deleteTicket(ticketId);
  }
});

appElement.addEventListener('change', (event) => {
  const target = (event.target as HTMLElement).closest<HTMLSelectElement>('[data-ticket-status]');
  if (!target) return;

  const ticketId = target.dataset.ticketStatus;
  if (ticketId) {
    (window as any).updateTicketStatus(ticketId, target.value as TicketStatus);
  }
});

// Pages
const renderHomePage = () => {
  renderPage(`
    <main class="container">
      <div class="card">
        <h2>Bienvenue sur Boleto</h2>
        <p>Gestion des tickets de support.</p>
        <div class="home-actions">
            <button class="btn" data-route="/login">Se connecter</button>
            <button class="btn" data-route="/signup">S'inscrire</button>
          <a class="btn" href="/api-docs" target="_blank" rel="noopener noreferrer">API docs</a>
        </div>
      </div>
    </main>
  `);
};

const renderLoginPage = () => {
  renderPage(`
    <main class="container">
      <div class="card">
        <h2>Connexion</h2>
        <div id="login-error" class="alert-error" style="display: none;"></div>
        <form id="login-form">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="login-email" required />
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <input type="password" id="login-password" required />
          </div>
          <button type="submit" class="btn">Se connecter</button>
        </form>
        <p class="form-footer">
           Pas de compte ? <a href="#" data-route="/signup">S'inscrire</a>
        </p>
      </div>
    </main>
  `);

  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('login-error');
    if (errorEl) errorEl.style.display = 'none';

    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;

    try {
      const { token, user } = await authRepository.login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigateTo('/tickets');
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = (error as Error).message;
        errorEl.style.display = 'block';
      }
    }
  });
};

const renderSignupPage = () => {
  renderPage(`
    <main class="container">
      <div class="card">
        <h2>Inscription</h2>
        <div id="signup-error" class="alert-error" style="display: none;"></div>
        <form id="signup-form">
          <div class="form-group">
            <label>Nom</label>
            <input type="text" id="signup-name" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="signup-email" required />
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <input type="password" id="signup-password" required />
          </div>
          <button type="submit" class="btn">S'inscrire</button>
        </form>
        <p class="form-footer">
           Déjà un compte ? <a href="#" data-route="/login">Se connecter</a>
        </p>
      </div>
    </main>
  `);

  document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('signup-error');
    if (errorEl) errorEl.style.display = 'none';

    const name = (document.getElementById('signup-name') as HTMLInputElement).value;
    const email = (document.getElementById('signup-email') as HTMLInputElement).value;
    const password = (document.getElementById('signup-password') as HTMLInputElement).value;

    try {
      await authRepository.signup(name, email, password);
      navigateTo('/login');
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = (error as Error).message;
        errorEl.style.display = 'block';
      }
    }
  });
};

const renderTicketsPage = async () => {
  try {
    const user = await authRepository.getCurrentUser();
    if (!user) { navigateTo('/login'); return; }

    const tickets = await ticketService.getTickets(user.id, user.role);

    const ticketsHtml = tickets.length > 0
      ? tickets.map(ticket => `
          <div class="ticket-item">
            <div class="ticket-info">
              <h3>${ticket.title}</h3>
              <p>${ticket.description}</p>
              <p>${user.role === 'AGENT'
                ? `<label>Statut <select data-ticket-status="${ticket.id}">
                    ${(['OUVERT', 'EN_COURS', 'TERMINE'] as TicketStatus[]).map(status => `<option value="${status}" ${ticket.statut === status ? 'selected' : ''}>${status}</option>`).join('')}
                  </select></label>`
                : `<span class="ticket-status ${ticket.statut}">${ticket.statut}</span>`} | ${ticket.client_id}</p>
            </div>
            <button class="btn btn-danger" data-delete-ticket="${ticket.id}">Supprimer</button>
          </div>
        `).join('')
      : '<p class="empty-state">Aucun ticket.</p>';

    renderPage(`
      <main class="container">
        <header class="tickets-header">
          <h2>Tickets</h2>
          <div class="header-actions">
            <button class="btn" data-route="/">Accueil</button>
            <button class="btn" data-action="logout">Déconnexion</button>
          </div>
        </header>
        <div class="user-info">
          <p>Connecté: <strong>${user.email}</strong> (${user.role})</p>
        </div>
        <div class="card">
          <h2>Nouveau ticket</h2>
          <div id="create-error" class="alert-error" style="display: none;"></div>
          <form id="create-form">
            <div class="form-group">
              <label>Titre</label>
              <input type="text" id="ticket-title" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea id="ticket-desc" required></textarea>
            </div>
            <button type="submit" class="btn">Créer</button>
          </form>
        </div>
        <div class="card">
          <h2>Mes tickets</h2>
          <div class="ticket-list">${ticketsHtml}</div>
        </div>
      </main>
    `);

    document.getElementById('create-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorEl = document.getElementById('create-error');
      if (errorEl) errorEl.style.display = 'none';

      const title = (document.getElementById('ticket-title') as HTMLInputElement).value;
      const description = (document.getElementById('ticket-desc') as HTMLTextAreaElement).value;

      try {
        await ticketService.createTicket({ title, description } as CreateTicketDTO, user.id);
        await renderTicketsPage();
      } catch (error) {
        if (errorEl) {
          errorEl.textContent = (error as Error).message;
          errorEl.style.display = 'block';
        }
      }
    });
  } catch (error) {
    renderPage(`
      <main class="container">
        <div class="card">
          <h2 class="alert-error">Erreur</h2>
          <p>${(error as Error).message}</p>
          <button class="btn" data-route="/">Accueil</button>
        </div>
      </main>
    `);
  }
};

// Fonctions globales
(window as any).deleteTicket = async (id: string) => {
  try {
    const user = await authRepository.getCurrentUser();
    if (!user) { navigateTo('/login'); return; }
    await ticketService.deleteTicket(id, user.id, user.role);
    await renderTicketsPage();
  } catch (error) {
    alert((error as Error).message);
  }
};

(window as any).updateTicketStatus = async (id: string, statut: TicketStatus) => {
  try {
    const user = await authRepository.getCurrentUser();
    if (!user) { navigateTo('/login'); return; }
    await ticketService.updateTicket(id, { statut } as UpdateTicketDTO, user.id, user.role);
    await renderTicketsPage();
  } catch (error) {
    alert((error as Error).message);
  }
};

(window as any).logout = async () => {
  await authRepository.logout();
  navigateTo('/');
};

(window as any).navigateTo = navigateTo;
window.addEventListener('popstate', handleRoute);
handleRoute();