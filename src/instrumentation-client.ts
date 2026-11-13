import { initBotId } from "botid/client/core";

// Attach BotID challenge headers to the one expensive request: the model proxy.
initBotId({
  protect: [
    {
      path: "/api/predict",
      method: "POST",
      advancedOptions: { checkLevel: "basic" },
    },
  ],
});
