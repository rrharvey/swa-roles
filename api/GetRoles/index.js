const fetch = require("node-fetch").default;

// add role names to this object to map them to group ids in your AAD tenant
const roleGroupMappings = {
  admin: "21a96550-aa02-486e-9297-e6e51b6398fc",
  reader: "33bb071c-118d-40d1-a5d7-7ced5900b973",
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

  context.res.json({
    roles,
  });
};

async function isUserInGroup(groupId, bearerToken, context) {
  const url = new URL("https://graph.microsoft.com/v1.0/me/memberOf");
  url.searchParams.append("$filter", `id eq '${groupId}'`);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  if (response.status !== 200) {
    return false;
  }

  const graphResponse = await response.json();

  context.log(JSON.stringify(graphResponse));

  const matchingGroups = graphResponse.value.filter(
    (group) => group.id === groupId
  );
  return matchingGroups.length > 0;
}
