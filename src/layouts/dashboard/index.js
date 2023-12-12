/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import data from "./../../data.json"
// Argon Dashboard 2 MUI components
import { Link } from 'react-router-dom';

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ReactPaginate from 'react-paginate';
import Button from '@mui/material/Button';
// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import CategoriesList from "examples/Lists/CategoriesList";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";
import { TextField, Select, MenuItem, FormControl, InputLabel, Paper, Typography, List, ListItem, ListItemText, Avatar, CircularProgress } from '@mui/material';

// Argon Dashboard 2 MUI base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import Slider from "layouts/dashboard/components/Slider";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
// Data
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import salesTableData from "layouts/dashboard/data/salesTableData";
import categoriesListData from "layouts/dashboard/data/categoriesListData";
import Board from 'react-trello'
import CustomCard from 'layouts/dashboard/CustomCard';
function Default() {

  const { size } = typography;
  const handleDragStart = (cardId, laneId) => {
    console.log('drag started');
    console.log(`cardId: ${cardId}`);
    console.log(`laneId: ${laneId}`);
  };

  const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
    console.log('drag ended');
    console.log(`cardId: ${cardId}`);
    console.log(`sourceLaneId: ${sourceLaneId}`);
    console.log(`targetLaneId: ${targetLaneId}`);

  };

  const [boardData, setBoardData] = useState({ lanes: [] });
  const [issues, setIssues] = useState([]);
  const [eventBus, setEventBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'table'
  const [currentPage, setCurrentPage] = useState(0);
  const issuesPerPage = 10; // Adjust as needed

  useEffect(() => {
    fetchGitHubIssues();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePageChange = (selectedObject) => {
    setCurrentPage(selectedObject.selected);
  };

  const toggleViewMode = () => {
    console.log("TOGGLE VIEW MODE");
    setViewMode(viewMode === 'board' ? 'table' : 'board');
  };

  const getRepoFromLink = (link) => {
    const parts = link.split('/');
    return `${parts[3]}/${parts[4]}`;
  };

  const fetchGitHubIssues = async () => {
    setLoading(true); // Start loading
    const allIssues = [];
    let page = 1; // Start from the first page
    let hasMoreIssues = true; // Flag to check if more issues are available
    const repoLink = getRepoFromLink("https://github.com/nf-core/viralintegration");

    try {
      while (hasMoreIssues) {
        const response = await fetch(`https://api.github.com/repos/${repoLink}/issues?state=all&page=${page}`, {
          headers: {
            Authorization: `Bearer ${'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'}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch issues: ${response.statusText}`);
        }

        const issues = await response.json();
        if (issues.length === 0) {
          hasMoreIssues = false; // No more issues, stop the loop
        } else {
          allIssues.push(...issues); // Add the issues to the array
          page++; // Increment the page number
        }
      }

      // Now allIssues contains all issues from all pages
      console.log(allIssues);
      setIssues(allIssues);
      const formattedBoardData = formatIssuesForBoard(allIssues);
      console.log(formattedBoardData);
      setBoardData({ "lanes": formattedBoardData });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading regardless of the result
    }
  };
  useEffect(() => {
    console.log("Updated boardData:", boardData);
  }, [boardData]);

  const formatIssuesForBoard = (issues) => {
    // Define the initial structure of lanes
    let lanes = [
      { id: 'open', title: 'Open', style: { width: 350 }, cards: [] },
      { id: 'inprogress', title: 'In Progress', style: { width: 350 }, cards: [] },
      { id: 'assigned', title: 'Assigned', style: { width: 350 }, cards: [] },
      { id: 'closed', title: 'Closed', style: { width: 350 }, cards: [] },
      // Removed 'unassigned' lane
    ];

    issues.forEach(issue => {
      // Create a card from the issue
      const card = {
        id: issue.id.toString(),
        title: issue.title ? issue.title : 'Title',
        description: issue.body ? issue.body : 'Description',
        label: issue.closed_at ? `Closed on ${new Date(issue.closed_at).toLocaleDateString()}` : `Created on ${new Date(issue.created_at).toLocaleDateString()}`,
        style: { width: 325, maxWidth: 310, margin: 'auto', marginBottom: 5 },
        url: issue.html_url,
        avatarUrl: issue.assignee ? issue.assignee.avatar_url : ""
      };

      // Determine the appropriate lane for the issue
      let laneId;
      if (issue.state === 'closed') {
        laneId = 'closed';
      } else if (issue.assignee) {
        laneId = 'assigned';
      } else {
        laneId = 'open';
      }

      // Find the lane and add the card
      let lane = lanes.find(l => l.id === laneId);
      if (lane) {
        lane.cards.push(card);
      }
    });

    return lanes;
  };
  // const [boardData, setBoardData] = useState({ lanes: [] });
  // const [eventBus, setEventBus] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await getBoard();
  //     setBoardData(response);
  //   };

  //   fetchData();
  // }, []);

  // const getBoard = () => {
  //   return new Promise((resolve) => {
  //     resolve(data);
  //   });
  // };

  const shouldReceiveNewData = (nextData) => {
    console.log('New card has been added');
    console.log(nextData);
  };

  const handleCardAdd = (card, laneId) => {
    console.log(`New card added to lane ${laneId}`);
    console.dir(card);
  };

  const components = {
    Card: CustomCard,
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox mb={3} display="flex" justifyContent="flex-start">
        <ToggleButtonGroup
          color="primary"
          value={viewMode}
          exclusive
          aria-label="Platform"
        >
          <ToggleButton onClick={() => setViewMode('board')} style={{ color: 'white', borderColor: 'white' }} value="board">Board View</ToggleButton>
          <ToggleButton onClick={() => setViewMode('table')} style={{ color: 'white', borderColor: 'white' }} value="table">Table View</ToggleButton>
        </ToggleButtonGroup>
      </ArgonBox>
      {loading ? (
        <CircularProgress style={{ margin: '20px auto', display: 'block' }} />
      ) : viewMode === 'board' ? (
        <ArgonBox sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>          <Board
          editable
          onCardAdd={handleCardAdd}
          data={boardData}
          draggable
          onDataChange={shouldReceiveNewData}
          eventBusHandle={setEventBus}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          components={components}
        />
        </ArgonBox>


      ) : (
        <ArgonBox sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}> {/* This maxHeight ensures that the content is never taller than the viewport height minus a fixed amount */}
          {issues.length > 0 && (
            <List>
              {issues.map((issue) => (
                <ListItem key={issue.id} alignItems="flex-start" style={{ flexDirection: 'column', alignItems: 'normal' }}>
                  <CustomCard
                    id={issue.id.toString()}
                    title={issue.title || 'No Title Provided'}
                    description={issue.body || 'No Description Available'}
                    label={issue.closed_at ? `Closed on ${formatDate(issue.closed_at)}` : `Created on ${formatDate(issue.created_at)}`}
                    url={issue.html_url || '#'}
                    avatarUrl={issue.assignee && issue.assignee.avatar_url ? issue.assignee.avatar_url : undefined}
                    style={{ width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} // Adjust the styles as necessary
                  />
                </ListItem>
              ))}
            </List>
          )}

          {issues.length === 0 && !loading && <Typography variant="body1">No issues found.</Typography>}
        </ArgonBox>
      )}


      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Default;
