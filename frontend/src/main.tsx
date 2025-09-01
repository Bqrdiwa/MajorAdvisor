import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./Application.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
import Dashboard from "./pages/dashboard/dashboard.tsx";
import Profile from "./pages/profile/profile.tsx";
import AuthPage from "./pages/auth/AuthPage.tsx";
import SummmeryPage from "./pages/summery/summerypage.tsx";
import Payment from "./pages/payment/payment.tsx";
import DangerPayment from "./pages/payment/danger.tsx";
import SuccessPayment from "./pages/payment/success.tsx";
import Commitment from "./pages/commitment/commitment.tsx";
import AdminPanel from "./pages/admin/admin.tsx";
import QuestionLayer from "./layouts/QuestionLayer.tsx";
const router = createBrowserRouter([
  {
    Component: QuestionLayer,
    children: [
      {
        path: "/auth",
        Component: AuthPage,
      },
      {
        Component: ProtectedLayout,
        children: [
          {
            path: "/",
            Component: App,
            children: [
              {
                path: "",
                Component: Dashboard,
              },
              {
                path: "profile",
                Component: Profile,
              },
              {
                path: "choice",
                Component: SummmeryPage,
              },
              {
                path: "payment",
                Component: Payment,
              },
              {
                path: "payment/danger",
                Component: DangerPayment,
              },
              {
                path: "payment/success",
                Component: SuccessPayment,
              },
              {
                path: "commitment",
                Component: Commitment,
              },
              {
                path: "admin",
                Component: AdminPanel,
              },
            ],
          },
        ],
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <HeroUIProvider>
    <ToastProvider />
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </HeroUIProvider>
);
