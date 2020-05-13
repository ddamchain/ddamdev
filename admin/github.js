"use strict";

const fs = require("fs");
const { resolve } = require("path");
const zlib = require("zlib");

const { fetchJson } = require("@ethersproject/web");

function addResponse(result, response) {
    return { result, response };
}

function loadFile(filename) {
    return JSON.parse(zlib.gunzipSync(fs.readFileSync(filename)).toString());
    //return JSON.parse(fs.readFileSync(filename).toString());
}

// @TODO: atomic
function saveFile(filename, content) {
    fs.writeFileSync(filename, zlib.gzipSync(JSON.stringify(content)));
    //fs.writeFileSync(filename, JSON.stringify(content));
}

function mockFetchJson(url, body, headers) {
    return {
        result: null,
        response: {
            statusCode: 304
        }
    }
}

async function createRelease(user, password, tagName, title, body, prerelease, commit) {
    const payload = {
        tag_name: tagName,
        target_commitish: (commit || "master"),
        name: title,
        body: body,
        //draft: true,
        draft: false,
        prerelease: !!prerelease
    };

    const headers = {
        "User-Agent": "ddamchain/ddamdev",
    };

    const result = await fetchJson({
        url: "https://api.github.com/repos/ddamchain/ddamdev/releases",
        user: user,
        password: password,
        headers: headers
    }, JSON.stringify(payload));


    return result.html_url;
}

module.exports = {
    createRelease,
}

