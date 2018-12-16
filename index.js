import { h, app } from "hyperapp";
import gql from "graphql-tag";
import { from } from "rxjs";
import { toPromise } from "rxjs/operators";
import client from "./createSangriaClient";

const query = `
  subscription NewAuthors {
    authorCreated {
      id
      version
      firstName
      lastName
    }
  }
`;

const state = {
  messages: [],
  sub: null
};

const actions = {
  subscribe: () => (state, actions) => {
    from(
      client.subscribe({
        query: gql`
          ${query}
        `,
        fetchPolicy: "no-cache"
      })
    ).
    subscribe(message => {
      actions.add(message);
    });
  },
  add: message => state => {
    return Object.assign({}, state, { messages: [...state.messages, message] });
  }
};

const view = (state, actions) => {
  return (
    <div>
      <h1>Sangria WebSocket Subscription with Apollo</h1>
      <button onclick={() => actions.subscribe()}>Subscribe</button>
      <ul>
        {state.messages.map((message, index) => (
          <li id={index}>{JSON.stringify(message)}</li>
        ))}
      </ul>
    </div>
  );
};

app(state, actions, view, document.body);
