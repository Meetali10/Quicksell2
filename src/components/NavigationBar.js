import React from 'react';

const NavigationBar = ({ handleGroupingChange, handleOrderingChange, ordering }) => {
  return (
    <div className="navbar">
      <div className="dropdown">
        <button className="dropbtn">Group By</button>
        <div className="dropdown-content">
          <a onClick={() => handleGroupingChange('status')}>Status</a>
          <a onClick={() => handleGroupingChange('user')}>User</a>
          <a onClick={() => handleGroupingChange('priority')}>Priority</a>
        </div>
      </div>
      <div className="dropdown">
        <button className="dropbtn">Sort By</button>
        <div className="dropdown-content">
          <a onClick={() => handleOrderingChange('priority')} className={ordering === 'priority' ? 'active' : ''}>Priority</a>
          <a onClick={() => handleOrderingChange('title')} className={ordering === 'title' ? 'active' : ''}>Title</a>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
