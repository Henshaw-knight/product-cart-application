import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/:id',
    renderMode: RenderMode.Client, // render on client, not prerendered
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
