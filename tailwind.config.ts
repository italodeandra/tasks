import { merge } from "lodash-es";
import tailwindConfig from "@italodeandra/ui/tailwind.config";
import { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Partial<Config> = {
  theme: {
    fontFamily: {
      mono: ["Fira Code Variable", ...defaultTheme.fontFamily.mono],
    },
  },
};

export default merge(tailwindConfig, config);
