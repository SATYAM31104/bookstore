import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumb">
      <div className="container">
        <ul className="breadcrumb-list">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <li className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}>
                {index === items.length - 1 ? (
                  <span>{item.label}</span>
                ) : (
                  <Link to={item.path}>{item.label}</Link>
                )}
              </li>
              {index < items.length - 1 && (
                <li className="breadcrumb-separator">›</li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Breadcrumb;