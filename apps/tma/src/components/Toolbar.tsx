import { Link, useLocation } from "react-router-dom";
import { routes } from "@/navigation/routes.tsx";
import { useTranslation } from "react-i18next";
import { useSound } from "./sound";

export const Toolbar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const soundInstance = useSound("switch");

  const onClick = () => {
    soundInstance?.play();
  };

  return (
    <div className="w-full bottom-0 px-4 bg-darkM flex justify-between border-t-2 border-borderM ">
      {routes
        .filter(({ nav }) => nav)
        .map(
          (route) =>
            route.nav && (
              <Link
                key={route.path}
                to={route.path}
                className={`flex-grow  ${location.pathname === route.path ? "-mt-0.5 pt-0.5 bg-darkM" : ""}`}
                onClick={onClick}
              >
                <div
                  className={`min-w-16 flex flex-col items-center gap-1 pt-2 border-x ${location.pathname === route.path ? "border-b border-borderM" : "border-transparent"}`}
                >
                  <img className="w-7 h-7" src={route.icon} />
                  <span
                    className={`text-whiteM text-3xs ${location.pathname === route.path ? "-mb-4 pb-2 bg-darkM px-1" : ""}  `}
                  >
                    {route.title ? t(route.title) : ""}
                  </span>
                </div>
              </Link>
            ),
        )}
    </div>
  );
};
