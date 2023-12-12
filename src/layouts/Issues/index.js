// GitHubIssues.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Paper, Typography, List, ListItem, ListItemText, Avatar, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './index.css';

const IssueTable = () => {
  const [repoLink, setRepoLink] = useState('');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'open', 'closed'
  const [currentPage, setCurrentPage] = useState(0);
  const issuesPerPage = 5; // Adjust the number of issues per page

  useEffect(() => {
    if (repoLink) {
      fetchIssues();
    }
  }, [repoLink, filter, currentPage]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiKey = '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';
      const response = await fetch(`https://api.github.com/repos/${getRepoFromLink(repoLink)}/issues?state=${filter}&page=${currentPage + 1}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch issues. ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      setIssues(data);
    } catch (error) {
      setError(error.message || 'An error occurred while fetching issues.');
    } finally {
      setLoading(false);
    }
  };

  const getRepoFromLink = (link) => {
    const parts = link.split('/');
    return `${parts[3]}/${parts[4]}`;
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIssues([]);
    setCurrentPage(0); // Reset to the first page when submitting a new request
    fetchIssues();
  };

  return (
    <Paper className="github-issues" elevation={3}>
      <form onSubmit={handleSubmit}>
        <InputLabel htmlFor="github-repo-link">Enter GitHub Repository Link</InputLabel>
        <TextField
          id="github-repo-link"
          variant="outlined"
          fullWidth
          value={repoLink}
          onChange={(e) => setRepoLink(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" disabled={loading} style={{ marginTop: '10px', backgroundColor: '#28a745', color: '#fff' }}>
          {loading ? 'Fetching Repository Info...' : 'Fetch Repository Info'}
        </Button>
      </form>

      {error && <Typography variant="body1" color="error">{error}</Typography>}

      {repoLink && (
        <Typography variant="body1" style={{ marginTop: '10px' }}>
          Repository Link: <a href={repoLink} target="_blank" rel="noopener noreferrer">{repoLink}</a>
        </Typography>
      )}

      <FormControl fullWidth style={{ marginTop: '20px' }}>
        <InputLabel style={{ marginBottom: '10px' }} htmlFor='selectform'>Filter by Issue State</InputLabel>
        <Select
          id='selectform'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </Select>
      </FormControl>

      <div className="issues-list" style={{ marginTop: '20px' }}>
        {loading && <CircularProgress style={{ margin: '20px auto', display: 'block' }} />}
        {issues.length > 0 && (
          <List>
            {issues.map((issue) => (
              <ListItem key={issue.id} className={`issue-${issue.state}`} alignItems="flex-start">
                <Avatar variant="rounded" style={{ backgroundColor: issue.state === 'open' ? '#28a745' : '#cb2431' }}>
                  {issue.state === 'open' ? 'O' : 'C'}
                </Avatar>
                <ListItemText
                  primary={
                    <Link to={issue.html_url} target="_blank" rel="noopener noreferrer">
                      {issue.title}
                    </Link>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" color="textSecondary">
                        Status: {issue.state}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Created: {formatDate(issue.created_at)}
                      </Typography>
                    </React.Fragment>
                  }
                  style={{ marginLeft: '10px' }}
                />
              </ListItem>
            ))}
          </List>
        )}

        {issues.length === 0 && !loading && <Typography variant="body1">No issues found.</Typography>}
      </div>

      {issues.length > 0 && (
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(issues.length / issuesPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      )}
    </Paper>
  );
};

export default IssueTable;
