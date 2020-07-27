import { Component } from "react";
import React from "react";
import ReactDOM from "react-dom";
import { Alert } from "evergreen-ui";

class App extends Component {
  render() {
    return (

      <Alert
      appearance="card"
      intent="warning"
      title="Você está temporariamente Suspenso, por infrigir alguma diretriz do Chegou, Entre em contato com o suporte."
      marginBottom={32}
    />


      
    );
  }
}
export default App;
