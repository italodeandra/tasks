import { merge } from "lodash-es";
import tailwindConfig from "@italodeandra/ui/tailwind.config";
import { Config } from "tailwindcss";

const config: Partial<Config> = {};

export default merge(tailwindConfig, config);
