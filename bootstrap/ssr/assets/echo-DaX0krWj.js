import Echo from "@ably/laravel-echo";
import * as Ably from "ably";
let echoInstance = null;
function getEcho() {
  if (echoInstance) {
    return echoInstance;
  }
  const key = "nqBbNw.xKFt7g:2caOyi7pySfB7JD1o2LmQZ5HuucNXCM0Pgjq7fqeacI";
  try {
    const ablyClient = new Ably.Realtime({ key });
    if (typeof window !== "undefined") {
      window.Ably = Ably;
    }
    const EchoClass = Echo;
    echoInstance = new EchoClass({
      broadcaster: "ably",
      client: ablyClient
    });
    if (typeof window !== "undefined") {
      window.Echo = echoInstance;
    }
    return echoInstance;
  } catch {
    return null;
  }
}
export {
  getEcho as g
};
