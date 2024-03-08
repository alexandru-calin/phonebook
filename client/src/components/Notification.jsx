const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  if (notification.success) {
    return <div className="notification success">{notification.message}</div>;
  }

  return <div className="notification error">{notification.message}</div>;
};

export default Notification;
