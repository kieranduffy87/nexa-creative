import { createHashRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import WorkPage from "./pages/WorkPage";
import ProjectPage from "./pages/ProjectPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HeroLabPage from "./pages/HeroLabPage";

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/services", element: <ServicesPage /> },
      { path: "/work", element: <WorkPage /> },
      { path: "/work/:slug", element: <ProjectPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      // Unlinked scratch route for comparing hero treatments
      { path: "/hero-lab", element: <HeroLabPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
