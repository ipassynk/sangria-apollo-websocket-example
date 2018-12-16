import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { Observable as LinkObservable, split, ApolloLink } from "apollo-link";
import { print } from "graphql/language/printer";
import { webSocket } from "rxjs/webSocket";
import { getMainDefinition } from "apollo-utilities";

class WebSocketBasicLink extends ApolloLink {
  constructor({ uri }) {
    super();

    this.requester = operation => {
      return new LinkObservable(observer => {
        const query = print(operation.query);
        const subject = webSocket(uri);
        subject.next({ query });
        const sub = subject.subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      });

      return () => {
        if (!sub.closed) {
          sub.unsubscribe();
        }
      };
    };
  }

  request(op) {
    return this.requester(op);
  }
}

function createSangriaLink() {
  return new WebSocketBasicLink({ uri: "ws://localhost:8080/graphql" });
}

const wsLink = createSangriaLink();
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  createHttpLink({ uri: "http://localhost:8080/graphql" })
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

export default client;
