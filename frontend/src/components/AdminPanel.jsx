// components/AdminPanel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { green, red } from '@mui/material/colors';

function AdminPanel() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/centers');
      setCenters(response.data);
    } catch (error) {
      console.error('Error fetching centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setLoading(true);
    try {
      const endpointMap = {
        approve: `http://localhost:5000/api/admin/approve/${id}`,
        reject: `http://localhost:5000/api/admin/reject/${id}`,
        block: `http://localhost:5000/api/admin/block/${id}`,
        unblock: `http://localhost:5000/api/admin/unblock/${id}`,
      };
      const response = await axios.patch(endpointMap[action]);
      alert(response.data.message);
      fetchCenters();
    } catch (error) {
      console.error(`Error on ${action}:`, error);
      alert(`Failed to ${action} center`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel - Manage Akshaya Centers
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        centers.map((center) => (
          <Card
            key={center._id}
            variant="outlined"
            sx={{
              mb: 2,
              borderColor: center.status === 'approved' ? green[500] : red[500],
            }}
          >
            <CardContent>
              <Typography variant="h6" component="div">
                {center.name}
              </Typography>
              <Typography color="text.secondary">Email: {center.email}</Typography>
              <Typography color="text.secondary">Status: {center.status}</Typography>
              <Typography color="text.secondary">
                Blocked: {center.blocked ? 'Yes' : 'No'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => handleAction(center._id, 'approve')}
                disabled={center.status === 'approved'}
              >
                Approve
              </Button>
              <Button
                size="small"
                color="secondary"
                onClick={() => handleAction(center._id, 'reject')}
                disabled={center.status === 'rejected'}
              >
                Reject
              </Button>
              <Button
                size="small"
                color="warning"
                onClick={() => handleAction(center._id, 'block')}
                disabled={center.blocked}
              >
                Block
              </Button>
              <Button
                size="small"
                color="success"
                onClick={() => handleAction(center._id, 'unblock')}
                disabled={!center.blocked}
              >
                Unblock
              </Button>
            </CardActions>
          </Card>
        ))
      )}
    </Box>
  );
}

export default AdminPanel;


// // components/AdminPanel.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// // import axiosInstance from '../axiosinterceptor';


// function AdminPanel() {
//   const [centers, setCenters] = useState([]);

//   useEffect(() => {
//     fetchCenters();
//   }, []);

//   const fetchCenters = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/admin/centers'); // Assumes an API endpoint to list all centers
//       setCenters(response.data);
//     } catch (error) {
//       console.error('Error fetching centers:', error);
//     }
//   };

//   const handleAction = async (id, action) => {
//     try {
//       const endpointMap = {
//         approve: `http://localhost:5000/api/admin/approve/${id}`,
//         reject: `http://localhost:5000/api/admin/reject/${id}`,
//         block: `http://localhost:5000/api/admin/block/${id}`,
//         unblock: `http://localhost:5000/api/admin/unblock/${id}`,
//       };
//       const response = await axios.patch(endpointMap[action]);
//       alert(response.data.message);
//       fetchCenters();
//     } catch (error) {
//       console.error(`Error on ${action}:`, error);
//       alert(`Failed to ${action} center`);
//     }
//   };

//   return (
//     <div>
//       <h2>Admin Panel - Manage Akshaya Centers</h2>
//       <ul>
//         {centers.map((center) => (
//           <li key={center._id}>
//             <p>Name: {center.name}</p>
//             <p>Email: {center.email}</p>
//             <p>Status: {center.status}</p>
//             <p>Blocked: {center.blocked ? 'Yes' : 'No'}</p>
//             <button onClick={() => handleAction(center._id, 'approve')} disabled={center.status === 'approved'}>
//               Approve
//             </button>
//             <button onClick={() => handleAction(center._id, 'reject')} disabled={center.status === 'rejected'}>
//               Reject
//             </button>
//             <button onClick={() => handleAction(center._id, 'block')} disabled={center.blocked}>
//               Block
//             </button>
//             <button onClick={() => handleAction(center._id, 'unblock')} disabled={!center.blocked}>
//               Unblock
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default AdminPanel;
