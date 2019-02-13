var request = require("request");

const tokenUrl = "https://github.com/login/oauth/access_token";
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

exports.handler = async function(event) {
  const code = event.path.replace("/githubAuth/", "");
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    code
  };
  const { access_token: token } = await new Promise((resolve, reject) => {
    request.post(tokenUrl, { json: body }, function(
      error,
      response,
      responseBody
    ) {
      if (!error && response.statusCode === 200) {
        resolve(responseBody);
      } else reject(error);
    });
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ token })
  };
};
