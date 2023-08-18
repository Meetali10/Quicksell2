import React, { useState, useEffect } from 'react';
import Navbar from './NavigationBar';
import TicketCard from './TicketCard';

const KanBanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [ordering, setOrdering] = useState('priority');
  const [users, setUsers] = useState([]); // Define a state for users

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
      const data = await response.json();

      const fetchedTickets = data.tickets.map(ticket => ({
        ...ticket,
        display: getGroupingValue(ticket),
        user: data.users.find(user => user.id === ticket.userId),
      }));

      setTickets(fetchedTickets);
      const sortedUsers = data.users.slice().sort((a, b) => a.name.localeCompare(b.name));
      setUsers(sortedUsers);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getGroupingValue = (ticket) => {
    switch (grouping) {
      case 'status':
        return ticket.status;
      case 'priority':
        return ticket.priority;
      case 'user':
        return ticket.userId;
      default:
        return '';
    }
  };

  const handleGroupingChange = (option) => {
    setGrouping(option);
  };

  const handleOrderingChange = (option) => {
    setOrdering(option);
    if (option === 'priority') {
      const sortedTickets = [...tickets].sort((a, b) => b.priority - a.priority);
      setTickets(sortedTickets);
    } else if (option === 'title') {
      const sortedTickets = [...tickets].sort((a, b) => a.title.localeCompare(b.title));
      setTickets(sortedTickets);
    }
  };

  return (
    <div className="kanban-board">
      <Navbar handleGroupingChange={handleGroupingChange} handleOrderingChange={handleOrderingChange} />
      <div className="board-columns">
        {grouping === 'user' ? (
          users.map(user => (
            <div className="board-column" key={user.id}>
              <h3>{user.name}</h3>
              <div className="ticket-list">
                {tickets
                  .filter(ticket => ticket.userId === user.id)
                  .sort((a, b) => {
                    if (ordering === 'priority') {
                      return b.priority - a.priority;
                    } else if (ordering === 'title') {
                      return a.title.localeCompare(b.title);
                    }
                    return 0;
                  })
                  .map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
              </div>
            </div>
          ))
        ) : grouping === 'status' ? (
          ['Backlog', 'Todo', 'In progress', 'Done', 'Cancelled'].map(status => (
            <div className="board-column" key={status}>
              <h3>{status}</h3>
              <div className="ticket-list">
                {tickets
                  .filter(ticket => getGroupingValue(ticket) === status)
                  .sort((a, b) => {
                    if (ordering === 'priority') {
                      return b.priority - a.priority;
                    }
                    return 0;
                  })
                  .map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
              </div>
            </div>
          ))
        ) : grouping === 'priority' ? (
          [0, 4, 3, 2, 1].map(priority => (
            <div className="board-column" key={priority}>
              <h3>{priority === 0 ? 'No Priority' : `Priority ${priority}`}</h3>
              <div className="ticket-list">
                {tickets
                  .filter(ticket => getGroupingValue(ticket) === priority)
                  .sort((a, b) => {
                    if (ordering === 'priority') {
                      return b.priority - a.priority;
                    }
                    return 0;
                  })
                  .map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
              </div>
            </div>
          ))
        ) : null /* Handle the default case */}
      </div>
    </div>
  );
};

export default KanBanBoard;