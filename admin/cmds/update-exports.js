"use strict";

const fs = require("fs");
const { resolve } = require("path");

const sourceEthers = fs.readFileSync(resolve(__dirname, "../../packages/ddamers/src.ts/ddamers.ts")).toString();
const targets = sourceEthers.match(/export\s*{\s*((.|\s)*)}/)[1].trim();

const output = `"use strict";

// To modify this file, you must update ./admin/cmds/update-exports.js

import * as ddamers from "./ddamers";

try {
    const anyGlobal = (window as any);

    if (anyGlobal._ddamers == null) {
        anyGlobal._ddamers = ddamers;
    }
} catch (error) { }

export { ddamers };

export {
    ${ targets }
} from "./ddamers";
`;

fs.writeFileSync(resolve(__dirname, "../../packages/ddamers/src.ts/index.ts"), output);
