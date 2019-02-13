import React from "react";
import GithubLogin from "./githubLogin";
import Chart from "./chart";

const Data = () => {
  const [repo, setRepo] = React.useState("thorium-sim/thorium");
  const [token, setToken] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [issues, setIssues] = React.useState(null);
  const [pageCount, setPageCount] = React.useState(0);

  async function getIssues(pageNum = 1) {
    setPageCount(pageNum);
    const pageUrl = `https://api.github.com/repos/${repo}/issues?sort=created&state=all&page=${pageNum}${token &&
      `&access_token=${token}`}`;
    const data = await fetch(pageUrl).then(res => {
      if (res.status !== 200) {
        setLoading(false);
        setError("Couldn't Load API. Probably a rate limiter.");
        return;
      }
      return res.json();
    });
    if (!data.length || data.length === 0) return [];
    return data.concat(await getIssues(pageNum + 1));
  }

  const load = () => {
    setLoading(true);
    getIssues().then(res => {
      const data = Object.entries(
        res
          .filter(r => !r.pull_request)
          .map(r => r.created_at)
          .reduce((prev, created) => {
            const date = new Date(created);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            prev[monthStart] = prev[monthStart] ? prev[monthStart] + 1 : 1;
            return prev;
          }, {})
      ).map(([date, count]) => ({ date: new Date(date), count }));
      setIssues(data);
      setLoading(false);
    });
  };

  if (loading) return <h1>Loading... Loaded {pageCount} pages.</h1>;
  if (error) return <h1>Error: {error}</h1>;
  return (
    <div>
      <label>
        Repo
        <input defaultValue={repo} onBlur={e => setRepo(e.target.value)} />
      </label>
      {!token && <GithubLogin setToken={setToken} />}
      <button onClick={load}>Load</button>
      <h1>Issues for {repo}</h1>
      {issues && <Chart issues={issues} />}
    </div>
  );
};
export default Data;
