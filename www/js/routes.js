routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/signin/',
    url: './pages/signin.html',
  },
  {
    path: '/signup/',
    url: './pages/signup.html',
  },

  {
    path: '/home/',
    url: './pages/home.html',
  },
  {
    path: '/datasources/',
    url: './pages/data-sources.html',
  },
  {
    path: '/editsources/',
    url: './pages/edit-sources.html',
  },
  {
    path: '/streamapprove/',
    url: './pages/stream-approve.html',
  },
  {
    path: '/youraccount/',
    url: './pages/your-account.html',
  },

  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
