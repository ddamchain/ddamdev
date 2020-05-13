'use strict';

console.log("Using global.ddamers");

const anyGlobal = (window as any);

const ddamers = anyGlobal._ddamers;

export { ddamers }
