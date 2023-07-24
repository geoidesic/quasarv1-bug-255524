import Vue from "vue";

import { i18n } from "src/boot/i18n";
import router from "src/router";
import routes from "src/router/routes";
import { notify } from "src/utils";

const route = router({ Vue, routes });

const showErrStructure = (err) => {
  console.debug("error ", err);
  console.debug("error JSON", err.toJSON());
  for (let prop in Object(err)) {
    console.debug(prop, err[prop]);
  }
};

const extractError = (err) => {
  let statusCode;
  // console.log(err.response);
  // console.log(err.response.status);
  // console.log(err.response.data);
  // console.log(err.response.headers);
  if (err.isAxiosError) {
    // console.log("extractError isAxiosError", err.isAxiosError);

    err.statusCode = err.response.status;
    // console.log("extractError status", err.statusCode);
    if (err.isAxiosError && err.response.status == 401) {
      window.location.reload();
    }
    if (err.isAxiosError && err.response.status == 403) {
      // console.log("err.response", err.response);
      notify(err.message, "negative");
    }
  } else {
    // console.log("extractError is NOT AXIOS");
    showErrStructure(err);
  }

  switch (err.statusCode) {
    case 422:
      let errString = "";
      console.debug("error 422");
      const errors = [i18n.t("error.422") + ":<br />"];
      showErrStructure(err);
      _.each(err.response.data.errors, (error) => {
        const pointerSplit = error.source.pointer.split("/");
        errors.push(
          "<strong>" +
            pointerSplit[pointerSplit.length - 1] +
            "</strong>: " +
            error.detail
        );
      });
      errString = errors.join("<br />");
      err.message = errString;
      break;

    default:
      console.debug("err", err);
      break;
  }
  // console.log(err);
  // console.log(err.detail);
  return {
    status: err.response.status,
    message: ((err) => {
      let message = '';
      message += err.message;
      if(err.response?.data?.errors?.[0]?.detail) {
        if(message.length) {
          message += ' : ';
        }
        message += err.response?.data?.errors?.[0]?.detail
      }
      if(err.response?.data?.errors?.[0]?.source?.pointer) {
        if(message.length) {
          message += ' : ';
        }
        message += err.response?.data?.errors?.[0]?.source?.pointer
      }
      return message})(err)
  };
};


export class PingError extends Error {
  constructor(message, from = "unknown", $store = false) {
    console.debug("PingError exception handler");
    console.debug("PingError exception handler args", arguments);
    notify(
      "Tried to contact the server. " +
        message +
        " " +
        (from && process.env.DEV ? `(${from})` : ""),
      "negative"
    );
    /**
     * @todo experimental - writes error to errors store
     */
    // if ($store && $store.rootState.settings.records[0].attributes.trackErrors) {
    //   $store.commit(
    //     "errors/STORE_RECORD",
    //     {
    //       date: new Date().toUTCString(),
    //       name: "PingError",
    //       message: message.toJSON(),
    //       id: uid(o)
    //     },
    //     { root: true }
    //   );
    // }
    super(message);
    this.name = "PingError";
  }
}

export class OfflineError extends Error {
  constructor(message, from = "unknown") {
    console.debug("OfflineError exception handler");
    console.debug("OfflineError exception handler args", arguments);
    notify(
      "Server is offline. " +
        message +
        " " +
        (from && process.env.DEV ? `(${from})` : ""),
      "warning"
    );
    super(message);
    this.status = 502;
    this.name = "OfflineError";
  }
}

export class MessageProcessError extends Error {
  constructor(err, from = "unknown") {
    const { status, message } = extractError(err);
    notify("Message error: " + message, "negative", {
      html: true,
      multiline: true,
      timeout: 0,
      actions: [
        {
          label: "Dismiss",
          color: "white",
          handler: () => {
            //- not sure that it's always useful to reload the route if there's an error. The reason to do this would be for a 401, in which case we should refresh page
            // route.go();
          },
        },
      ],
    });
    super(err);
    this.status = status;
    this.name = "mProcessError";
  }
}

export class TransportError extends Error {
  constructor(err, from = "unknown") {
    console.debug("TransportError exception handler");
    console.debug("TransportError exception handler args", arguments);
    console.debug("TransportError exception handler args", err);
    const { status, message } = extractError(err);
    console.debug("TransportError exception errString", errString);
    notify(
      "TransportError: " +
        message +
        " " +
        (from && process.env.DEV ? `(${from})` : ""),
      "negative"
    );
    super(err);
    this.status = status;
    this.name = "TransportError";
  }
}

export class QueueError extends Error {
  constructor(message) {
    console.debug("QueueError exception handler");
    console.debug("QueueError exception handler args", arguments);
    super(message);
    this.name = "QueueError";
  }
}

export class RouterError extends Error {
  constructor(message) {
    console.debug("RouterError exception handler");
    console.debug("RouterError exception handler args", arguments);
    super(message);
    this.name = "RouterError";
  }
}
