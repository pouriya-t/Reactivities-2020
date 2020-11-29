import { Component } from "react";
import "./App.css";
import axios from "axios";
import { Header, List, Icon } from "semantic-ui-react";

class App extends Component {
  state = {
    values: [],
  };

  componentDidMount() {
    axios.get("http://localhost:5000/api/values").then((response) => {
      this.setState({
        values: response.data,
      });
    });
  }

  render() {
    return (
      <div>
        <Header>
          <Icon name="users" />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List>
          {this.state.values.map((value) => (
            <List.Item key={value.name}>{value.name}</List.Item>
          ))}
        </List>
      </div>
    );
  }
}

export default App;
