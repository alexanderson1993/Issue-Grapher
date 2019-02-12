import React from "react";
import GitHubLogin from "react-github-login";
const Data = () => {
  const [repo, setRepo] = React.useState("thorium-sim/thorium");
  const [code, setCode] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [issues, setIssues] = React.useState([]);
  async function getIssues(pageNum = 1) {
    return [];
    const pageUrl = `https://api.github.com/repos/${repo}/issues?sort=created&state=all&page=${pageNum}`;
    const data = await fetch(pageUrl).then(res => {
      if (res.status !== 200) {
        setLoading(false);
        setError("Couldn't Load API. Probably a rate limiter.");
        return;
      }
      return res.json();
    });
    if (data.length === 0) return [];
    return data.concat(await getIssues(pageNum + 1));
  }
  React.useEffect(() => {
    setLoading(true);
    getIssues().then(res => {
      setIssues(res);
      setLoading(false);
    });
  }, [repo]);
  const onSuccess = response => setCode(response.code);
  const onFailure = response => console.error(response);
  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;
  return (
    <div>
      <label>
        Repo
        <input value={repo} onBlur={e => setRepo(e.target.value)} />
      </label>
      <GitHubLogin
        clientId="e99e9e80650f93c387d0"
        onSuccess={onSuccess}
        onFailure={onFailure}
        redirectUri="http://localhost:3000/callback"
      />
      <h1>Issues for {repo}</h1> <h2>Count: {issues.length}</h2>
    </div>
  );
};
export default Data;
