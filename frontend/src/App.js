import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/thunks/user";
import * as gameActions from "./store/thunks/game";
import * as taskActions from "./store/thunks/task";
import Navigation from "./components/Navigation";
import Splash from "./components/Splash";
import Game from "./components/Game";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(user => {
        if (user && user.gameId) {
          dispatch(gameActions.getOneGame(user.gameId))
            .then(game => (game.stage !== 'Final') && dispatch(taskActions.getOneTask({ gameId: game.id, userId: user.id, round: game.round })));
        };
      })
      .then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Splash />
          </Route>
          <Route exact path="/login">
            <LoginFormPage />
          </Route>
          <Route exact path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/game">
            <Game />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
