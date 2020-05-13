The DDAM Project
==================

**EXPERIMENTAL**

Installing
----------

**node.js**

```
$ npm install --save ddamers@next
```

Hacking
-------

This project uses a combination of Lerna and the ./admin scripts to manage
itself as a package of packages.

The umbrella package can be found in `packages/ddamers`, and all packages in general
can be found in the `packages/` folder.

If you add new dependencies to any package (incuding internal dependencies), you will
need to re-create the internal links and re-build teh dependency graph::

```
$ npm run bootstrap
```

To run a continuous build (with incremental TypeScript compilation):

```
$ npm run auto-build
```

Finally, once you have made all your changes, you will need to bump the version
of packages that changed their NPM tarballs, as well as update the _version.*
and distribution builds (which is what we host on the CDN for browser-based
apps). To do this, run:


```
$ npm run update-versions
```

Which will also list all packages that have changed along with the specifc files.


License
-------

MIT License (including **all** dependencies).

