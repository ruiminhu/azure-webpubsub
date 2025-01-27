import { WebPubSubServiceClientOptions } from "@azure/web-pubsub";
import debugModule from "debug";

const T = (now: Date) => `${now.toLocaleString().replace(" AM", "").replace(" PM", "")}:${now.getMilliseconds().toString().padStart(3, '0')}`; // prettier-ignore

debugModule.log = (msg, ...args) => {
  const timestamp = T(new Date());
  console.log(`[${timestamp}] ${msg}`, ...args);
};

const addProperty = (o: object, p: string, f: Function) => {
  Object.defineProperty(o, p, {
    value: f,
    writable: true,
    enumerable: false,
    configurable: true,
  });
};

interface WebPubSubExtensionOptions {
  connectionString: string;
  hub: string;
  path: string;
  webPubSubServiceClientOptions?: WebPubSubServiceClientOptions;
}

export { WebPubSubExtensionOptions, debugModule, T, addProperty };
