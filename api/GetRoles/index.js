const fetch = require("node-fetch").default;

// add role names to this object to map them to group ids in your AAD tenant
const roleGroupMappings = {
  foo: "192e3a50-f935-451f-9f0d-72cfeb1edab1",
  sampleGroup: "15b73fc6-0905-4489-9e3d-fc51dc2821b2",
};

module.exports = async function (context, req) {
  const user = req.body || {};
  const roles = [];

  for (const key in req.headers) {
    context.log(`${key}=${req.headers[key]}`);
  }

  for (const key in user) {
    context.log(`user.${key}=${user[key]}`);
  }

  for (const [role, groupId] of Object.entries(roleGroupMappings)) {
    if (await isUserInGroup(groupId, user.accessToken, context)) {
      roles.push(role);
    }
  }

  context.log(`roles = ${JSON.stringify(roles)}`);

  context.res.json({
    roles,
  });
};

async function isUserInGroup(groupId, bearerToken, context) {
  const url = new URL("https://graph.microsoft.com/v1.0/me/memberOf");
  url.searchParams.append("$filter", `id eq '${groupId}'`);

  context.log(`GET ${url}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  if (response.status !== 200) {
    return false;
  } else {
    context.error(`${response.status}: ${response.statusText}`);
  }

  const graphResponse = await response.json();

  context.log(JSON.stringify(graphResponse));

  const matchingGroups = graphResponse.value.filter(
    (group) => group.id === groupId
  );
  return matchingGroups.length > 0;
}
