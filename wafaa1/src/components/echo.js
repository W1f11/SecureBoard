import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: process.env.REACT_APP_PUSHER_APP_KEY, // clé publique Pusher
  cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
  forceTLS: true,
});

export default echo;
