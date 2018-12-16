import { h, app } from "./hyperappV2/hyperapp";
import { apolloSubscption } from "./apolloSubscription";

const ToggleSubscription = state =>
  Object.assign({}, state, { subscribe: !state.subscribe });

const ClearMessages = state => Object.assign({}, state, { messages: [] });

app({
  init: { messages: [], subscribe: false },
  view: state => (
    <div>
      <h1>Sangria WebSocket Subscription with Apollo, RxJs and HyperappV2</h1>
      <header class="navbar">
        <section class="navbar-section">
          <button
            class="btn btn-primary"
            style={{ marginRight: 10 }}
            onclick={ToggleSubscription}
          >
            Switch {state.subscribe ? "Off" : "On"} Subscription
          </button>

          <button class="btn" onclick={ClearMessages}>
            ClearMessages
          </button>
        </section>
      </header>
      <div>&nbsp;</div>
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">Messages</div>
        </div>
        <div class="panel-body">
          <ul>
            {state.messages.map(({ firstName, lastName }, index) => (
              <li id={index}>
                {firstName} {lastName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ),
  subscriptions: state => state.subscribe && apolloSubscption(),
  container: document.body
});
