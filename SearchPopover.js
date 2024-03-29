import * as Popover from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchPopover.css";

export const SearchPopover = ({ children, array, inputRef }) => {
  const [isPopoverOpen, setPopoverOpen] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (inputRef.current.value.length > 0) {
      setPopoverOpen(true);
      requestAnimationFrame(() =>
        setTimeout(() => {
          inputRef.current.focus();
        }, 0)
      );

      return;
    }
    setPopoverOpen(false);
  }, [array]);
  const navigateToUserProfileHandler = (username = "") => {
    if (username) {
      navigate("/profile/" + username);
      inputRef.current.value = "";
      setPopoverOpen(false);
    }
  };
  return (
    <div className="Popover">
      <Popover.Root open={isPopoverOpen}>
        <Popover.Trigger className="PopoverTrigger">
          {" "}
          {children}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={10}
            side="bottom"
            className="PopoverContent"
          >
            {array.length <= 0 && (
              <h6
                className="info-Card-users-info-name"
                style={{ fontSize: "small", textAlign: "center" }}
              >
                No Search Result
              </h6>
            )}
            {array?.map((user) => (
              <div
                key={user?._id}
                className="info-Card-users-container"
                onClick={() => navigateToUserProfileHandler(user?.username)}
              >
                <div key={user?._id} className="info-Card-users">
                  <div className="info-card-users-img">
                    <img
                      src={user?.avatar}
                      height="30"
                      style={{
                        height: "30px",
                        width: "30px",
                        backgroundColor: "var(--primary-color)",
                      }}
                    />
                  </div>
                  <div className="info-Card-users-info">
                    <h6
                      className="info-Card-users-info-name"
                      style={{ fontSize: "small" }}
                    >
                      {user?.firstName} {user?.lastName}
                    </h6>
                    <p
                      className="info-Card-users-info-username"
                      style={{ fontSize: "smaller" }}
                    >
                      @{user?.username}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};