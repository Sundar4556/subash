import "./Profile.css";
import { RxDotsHorizontal } from "react-icons/rx";
import { RxArrowLeft } from "react-icons/rx";
import { RxCamera } from "react-icons/rx";
import { RxPencil1 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import { Feed } from "../Feed/Feed";
import { Navbar } from "../../Components/Navbar/Navbar";
import { useData } from "../../Context/dataContext";
import { PostCard } from "../../Components/PostCard/PostCard";
import { LikePopover } from "../../Components/Popover/LikePopover";
import { useAuth } from "../../Context/authContext";
import { Button } from "react-bootstrap";
import {
  followUser,
  unfollowUser,
} from "../../AsyncUtilities/dataAsyncHelpers";
import { EditProfilePopover } from "../../Components/Popover/EditProfilePopover";
import { EditImageDialogBox } from "../../Components/EditProfile/EditImageDialogBox";
import { EditInfoDialogBox } from "../../Components/EditProfile/EditInfoDialogBox";
import { renderMessageWithLinks } from "../../../Utils/utils";
export const Profile = () => {
  const { username: usernameParams } = useParams();
  const { user, setUser, token } = useAuth();
  const navigate = useNavigate();
  const {
    dataState: { users, posts },
  } = useData();

  const foundUser = users?.find(({ username }) => username === usernameParams);

  const foundPostOfUser = posts?.filter(
    ({ username }) => usernameParams === username
  );

  const isCurrentUserFollowing = user?.following.some(
    ({ username }) => username === foundUser?.username
  );

  const followHandler = () => {
    if (token) {
      followUser(foundUser?._id, token, setUser);
    }
  };
  const unFollowHandler = () => {
    if (token) {
      unfollowUser(foundUser?._id, token, setUser);
    }
  };

  const bio = renderMessageWithLinks(foundUser?.bio, navigate);

  return (
    <Feed
      navbar={
        <Navbar
          title={`${foundUser?.firstName ?? ""} ${foundUser?.lastName ?? ""}`}
        />
      }
    >
      <div className="header-fixed-container">
        <div className="profile-header">
          <div className="profile-header-action" onClick={() => navigate("/")}>
            <RxArrowLeft />
          </div>
          {foundUser?.username === user?.username && (
            <EditProfilePopover foundUser={foundUser}>
              <div className="profile-header-action">
                <RxDotsHorizontal />
              </div>
            </EditProfilePopover>
          )}
        </div>
      </div>

      <div className="profile">
        <div className="header-bg">
          <img
            src={
              foundUser?.bg ||
              "https://images.pexels.com/photos/5253574/pexels-photo-5253574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            }
          />
          {user?.username === foundUser?.username && (
            <EditImageDialogBox
              dialogFor={"background"}
              foundUser={foundUser}
              title={"Edit Background Image"}
            >
              <div className="editBgIcon">
                <RxCamera />
              </div>
            </EditImageDialogBox>
          )}
          <div className="profile-avatar">
            <img
              src={
                foundUser?.avatar ||
                "https://www.svgrepo.com/show/311076/person-question-mark.svg"
              }
            />
            {user?.username === foundUser?.username && (
              <EditImageDialogBox
                dialogFor={"avatar"}
                foundUser={foundUser}
                title={"Edit Avatar"}
              >
                <div className="editAvatarIcon">
                  <RxCamera />
                </div>
              </EditImageDialogBox>
            )}
          </div>
        </div>
        <div className="profile-name-header">
          <div className="profile-name-header-flex">
            <div>
              <div className="profile-name">
                {foundUser?.firstName} {foundUser?.lastName}
              </div>
              <div className="profile-username">{foundUser?.username && "@"+foundUser?.username}</div>
            </div>
            {user?.username === foundUser?.username && (
              <EditInfoDialogBox foundUser={foundUser}>
                <RxPencil1 />
              </EditInfoDialogBox>
            )}
            {user?.username !== foundUser?.username && (
              <div className="profile-follow-btn">
                {isCurrentUserFollowing ? (
                  <Button
                    variant="secondary"
                    className="info-Card-users-btn"
                    onClick={unFollowHandler}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="info-Card-users-btn"
                    onClick={followHandler}
                  >
                    Follow
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="profile-bio">{bio}</div>
          <a className="profile-link" src={foundUser?.username}>
            {foundUser?.link}
          </a>
        </div>
        <div className="profile-dashboard">
          <div className="profile-dashboard-info">
            <span className="profle-dashboard-info-data">
              {foundPostOfUser?.length ?? "-"}
            </span>
            <span className="profle-dashboard-info-data-name">Posts</span>
          </div>
          <LikePopover likedBy={foundUser?.followers}>
            <div className="profile-dashboard-info">
              <span className="profle-dashboard-info-data">
                {" "}
                {foundUser?.followers?.length ?? "-"}
              </span>
              <span className="profle-dashboard-info-data-name">Followers</span>
            </div>
          </LikePopover>

          <LikePopover likedBy={foundUser?.following}>
            <div className="profile-dashboard-info">
              <span className="profle-dashboard-info-data">
                {foundUser?.following?.length ?? "-"}
              </span>
              <span className="profle-dashboard-info-data-name">Following</span>
            </div>
          </LikePopover>
        </div>

        <div className="profile-posts">
          {!foundUser?.username && <h6>Account by username @{usernameParams} does not exist!</h6>}
          {foundPostOfUser?.map((post) => (
            <PostCard post={post} />
          ))}
        </div>
      </div>
    </Feed>
  );
};