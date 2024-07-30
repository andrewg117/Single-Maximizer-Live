import { type Plugin } from "vite";

export function CssModuleTypes(): Plugin {
  return {
    name: "css-modules-types",
    apply: "serve",
    // async configureServer() {
    //   //code will be added later
    // },
    // // HMR
    // async handleHotUpdate({ server: { config }, file }) {
    //   //code will be added later
    // },
  };
}
