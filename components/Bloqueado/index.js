import { Component } from "react";
import React from "react";
import ReactDOM from "react-dom";
import { Alert } from "evergreen-ui";

class App extends Component {
  render() {
    return (
      <Alert intent="danger" title="Cadastro Bloqueado">
        Você está temporariamente Bloqueado, entre em contato com o suporte.
      </Alert>
    );
  }
}
export default App;
