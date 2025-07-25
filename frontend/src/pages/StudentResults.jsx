import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import FloatingChat from '../components/student/FloatingChat';
import socket from '../../src/socket';

const StudentResults = ({ poll }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState({});

  useEffect(() => {
    if (!poll) {
      navigate('/student-waiting');
      return;
    }

    socket.on('poll-results', (data) => {
      setResults(data);
    });

    return () => {
      socket.off('poll-results');
    };
  }, [poll, navigate]);

  useEffect(() => {
    const handleKicked = () => {
      navigate('/kicked');
    };

    socket.on('kicked', handleKicked);
    return () => {
      socket.off('kicked', handleKicked);
    };
  }, [navigate]);

  const chartData = poll.options.map((opt) => ({
    option: opt,
    votes: results[opt] || 0,
  }));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 relative">
      <h2 className="text-xl font-bold text-darkText mb-4 text-center">{poll.question}</h2>
      <p className="text-grayText text-sm mb-6">Here’s how everyone answered:</p>

      <div className="w-full max-w-lg h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="option" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="votes" fill="#4F0DCE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <FloatingChat
        pollId={poll._id}
        sender={sessionStorage.getItem('studentName')}
      />
    </div>
  );
};

export default StudentResults;
