import React from "react";
import GitHubLogin from "react-github-login";

const GithubLogin = ({ setToken }) => {
  const onSuccess = response => {
    const { code } = response;
    console.log(code);
    fetch(`/.netlify/functions/githubAuth/${code}`)
      .then(res => res.json())
      .then(({ token }) => {
        console.log(token);
        setToken(token);
      });
  };
  const onFailure = response => console.error(response);
  return (
    <GitHubLogin
      clientId="e99e9e80650f93c387d0"
      onSuccess={onSuccess}
      onFailure={onFailure}
      redirectUri={`${window.location.origin}/callback`}
    />
  );
};

export default GithubLogin;
