import { createFileRoute, redirect } from "@tanstack/react-router";

// El sitio de EMCA System es HTML/CSS/JS plano y vive en /public.
// Esta ruta redirige la raíz al sitio estático.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/index.html", reloadDocument: true });
  },
  component: () => null,
});
