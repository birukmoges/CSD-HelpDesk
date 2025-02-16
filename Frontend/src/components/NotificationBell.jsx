import { useState } from "react";
import { AiOutlineBell, AiFillBell } from "react-icons/ai";

const NotificationBell = (props) => {

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setHasUnread(false); // Mark as read when opened
  };

  console.log(`this is the notificaton ${props.message}`);

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button onClick={toggleDropdown} className="relative p-2">
        {hasUnread ? <AiFillBell size={24} /> : <AiOutlineBell size={24} />}
        {hasUnread && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown Notification List */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2">
          {props.notifications.length === 0 ? (
            <p className="text-gray-500 text-sm p-2">No new props.notifications</p>
          ) : (
            props.notifications.map((note, index) => (
              <div
                key={index}
                className="p-2 text-sm border-b last:border-none hover:bg-gray-100"
              >
                {note.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;