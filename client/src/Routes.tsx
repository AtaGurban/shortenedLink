import React, { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MAIN_PAGE } from "./utils/pathConsts";
import MyLoader from "./components/UI/MyLoader";
import { routes } from "./utils/routesList";

const MainRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<MyLoader />}>
        <Routes>
          {routes.map((item) => {
            return (
              <Route element={item.element} path={item.path} key={item.path} />
            );
          })}
          <Route path="*" element={<Navigate to={MAIN_PAGE} />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default MainRouter;
