import { BusinessCenter, Info } from "@mui/icons-material";
import type { TFunction } from "i18next";

export const getMenu = (t: TFunction, logout: () => void) => [
  {
    title: t("sidebar.home"),
    icon: <BusinessCenter />,
    path: "/app",
  },
  {
    title: t("sidebar.logout"),
    icon: <Info />,
    path: "/login",
    onClick: logout,
  },
];