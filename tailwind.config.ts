import { merge } from "lodash-es";
import tailwindConfig from "@italodeandra/ui/tailwind.config";
import { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Partial<Config> = {
  theme: {
    extend: {
      fontFamily: {
        mono: ["Fira Code Variable", ...defaultTheme.fontFamily.mono],
      },
      keyframes: {
        expand: {
          from: {
            height: "0px",
            width: "0px",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
            width: "var(--radix-accordion-content-width)",
          },
        },
        collapse: {
          from: {
            height: "var(--radix-accordion-content-height)",
            width: "var(--radix-accordion-content-width)",
          },
          to: {
            height: "0px",
            width: "0px",
          },
        },
      },
      animation: {
        expand: "expand 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        collapse: "collapse 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
};

export default merge(tailwindConfig, config);
