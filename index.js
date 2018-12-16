import { h, app } from "./hyperappV2/hyperapp";
import { apolloSubscption } from "./apolloSubscription";

const ToggleSubscription = state =>
  Object.assign({}, state, { subscribe: !state.subscribe });

app({
  init: { messages: [], subscribe: false },
  view: state => (
    <div>
      <h1>Sangria WebSocket Subscription with Apollo, RxJs and HyperappV2</h1>
      <button onclick={ToggleSubscription}>Switch {state.subscribe? 'Off': 'On'} Subscription</button>
      <h2>Messages:</h2>
      <ul>
        {state.messages.map(({ firstName, lastName }, index) => (
          <li id={index}>
            {firstName} {lastName}
          </li>
        ))}
      </ul>
    </div>
  ),
  subscriptions: state => state.subscribe && apolloSubscption(),
  container: document.body
});
