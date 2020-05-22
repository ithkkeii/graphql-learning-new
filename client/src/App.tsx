import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import MainPage from "./components/page/MainPage";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthPage from "./components/page/AuthPage";
import { useQuery } from "@apollo/react-hooks";
import { GET_USER } from "./mutations";
import { getCurrentUser } from "./services/authService";
import NavBar from "./components/navBar/NavBar";
import ContestDetailsPage from "./components/page/ContestDetailsPage";

const App: React.FC = () => {
  const { client } = useQuery(GET_USER);

  useEffect(() => {
    const user = getCurrentUser();
    client.writeQuery({
      query: GET_USER,
      data: { user: user },
    });
  }, [client]);

  const NavRoute = useCallback(
    ({
      exact,
      path,
      component: Component,
    }: {
      exact: boolean;
      path: string;
      component: React.FC;
    }) => (
      <Route exact={exact} path={path}>
        <NavBar />
        <Component />
      </Route>
    ),
    []
  );

  const ProtectedRoute = ({
    component: Component,
    ...rest
  }: {
    component: React.FC;
  }) => (
    <Route {...rest}>
      {!getCurrentUser() ? (
        <Redirect to={{ pathname: "/signIn" }} />
      ) : (
        <Component />
      )}
      ;
    </Route>
  );

  return (
    <SApp>
      <Switch>
        <Route
          exact
          path="/signIn"
          component={() => <AuthPage type="signIn" />}
        />
        <Route
          exact
          path="/signUp"
          component={() => <AuthPage type="signUp" />}
        />
        <NavRoute exact path="/contests" component={MainPage} />
        <NavRoute exact path="/contests/:id" component={ContestDetailsPage} />
        <NavRoute exact path="/practice" component={MainPage} />
        <Redirect exact from="/" to="/contests" />
        <Redirect to="/contests" />
      </Switch>
    </SApp>
  );
};

export default App;

const SApp = styled.div``;
