import gql from "graphql-tag";
import { from } from "rxjs";
import client from "./createSangriaClient";

const effect = function(props, dispatch) {
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

  const sub = from(
    client.subscribe({
      query: gql`
        ${query}
      `,
      fetchPolicy: "no-cache"
    })
  ).subscribe(msg => {
    debugger;
    const {
      data: {
        authorCreated: { firstName, lastName }
      }
    } = msg;
    dispatch(props.action, { firstName, lastName });
  });

  return () => sub.unsubscribe();
};

const AddMessage = (state, message) =>
  Object.assign({}, state, { messages: [...state.messages, message] });

export const apolloSubscption = props => ({
  effect: effect,
  action: AddMessage
});
