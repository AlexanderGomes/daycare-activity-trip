import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Overview.css";
import Search from "../../assets/Search-pana.svg";
import { AiFillCloseCircle } from "react-icons/ai";
import { UsersList, AdminList, TravelersList } from "../";

const Overview = ({
  tripId,
  isAdmin,
  setTrip,
  socket,
  setNotiData,
  setArrival,
  notiData,
  active,
}) => {
  const [chosen, setChosen] = useState([]);
  const [users, setUser] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [adminPopUp, setAdminPopUp] = useState(false);
  const [trPopUp, setTrPopUp] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [updatedTrip, setUpdatedTrip] = useState(null);
  const [usersOnTrip, setUsersOnTrip] = useState([]);

  const GetChosenTemps = async () => {
    try {
      const res = await axios.get(`/api/temp/get/chosen/${tripId}`);
      setChosen(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const GetUsers = async () => {
    try {
      const res = await axios.get(`/api/user/get/users`);
      setUser(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUserOnTrip = async () => {
    const res = await axios.get(`/api/user/get/allowed/users/info/${tripId}`);
    setUsersOnTrip(res.data);
  };

  useEffect(() => {
    GetChosenTemps();
    GetUsers();
    getUserOnTrip();
  }, []);

  useEffect(() => {
    socket.current.on("getChange", (data) => {
      setUpdatedUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        invitations: data.invitations,
        invitedTo: data.invitedTo,
      });
    });
  }, []);

  useEffect(() => {
    socket.current.on("getUserOnTrip", (data) => {
      setUpdatedTrip({
        userId: data.userId,
      });
    });
  }, []);

  useEffect(() => {
    if (updatedUser !== null || updatedTrip !== null) {
      GetChosenTemps();
      GetUsers();
      getUserOnTrip();
    }
  }, [updatedUser, updatedTrip]);

  return (
    <div className="over__before__main">
      <div className="over__user__list">
        <div className="over__info">
          {isAdmin === true ? (
            <>
              <p
                className="over__info__admin"
                onClick={() => setAdminPopUp(true)}
              >
                Admins
              </p>
              <p className="over__info__tr" onClick={() => setTrPopUp(true)}>
                Travelers
              </p>
            </>
          ) : (
            <>
              <p className="over__info__tr" onClick={() => setTrPopUp(true)}>
                Travelers
              </p>
            </>
          )}
        </div>
      </div>
      <p className="over__warning">
        Scroll inside each category to explore all the options!!{" "}
        <span className="over__warning__span">
          If they are empty I think you know what to do.
        </span>
      </p>

      {isAdmin === true ? (
        <div className="over__add__user">
          <p className="over__user__p" onClick={() => setPopUp(true)}>
            Add user by Email
          </p>
        </div>
      ) : (
        ""
      )}
      <UsersPopUp
        popUp={popUp}
        setPopUp={setPopUp}
        users={users}
        tripId={tripId}
        setUser={setUser}
        socket={socket}
        setNotiData={setNotiData}
        notiData={notiData}
        setArrival={setArrival}
      />
      <AdminListUser
        setPopUp={setAdminPopUp}
        popUp={adminPopUp}
        usersOnTrip={usersOnTrip}
        tripId={tripId}
        setUsersOnTrip={setUsersOnTrip}
        setTrip={setTrip}
        setUser={setUser}
        socket={socket}

      />
      <TrList
        setPopUp={setTrPopUp}
        popUp={trPopUp}
        usersOnTrip={usersOnTrip}
        tripId={tripId}
        isAdmin={isAdmin}
        setUsersOnTrip={setUsersOnTrip}
        setUser={setUser}
        setTrip={setTrip}
        socket={socket}
      />

      <div className="over__main">
        <div className="over__block">
          <p className="over__label">Where to</p>
          <div className={"over__inner"}>
            {chosen.map((c) => (
              <div key={c._id}>
                {c.label === "destination" ? <Destination c={c} /> : ""}
              </div>
            ))}
          </div>
        </div>

        <div className="over__block">
          <p className="over__label">Restaurants</p>
          <div className={"over__inner"}>
            {chosen.map((c) => (
              <div key={c._id}>
                {c.label === "restaurant" ? <Restaurant c={c} /> : ""}
              </div>
            ))}
          </div>
        </div>

        <div className="over__block">
          <p className="over__label">Hotels</p>
          <div className={"over__inner"}>
            {chosen.map((c) => (
              <div key={c._id}>
                {c.label === "stays" ? <Stays c={c} /> : ""}
              </div>
            ))}
          </div>
        </div>

        <div className="over__block">
          <p className="over__label">Activities</p>
          <div className={"over__inner"}>
            {chosen.map((c) => (
              <div key={c._id}>
                {c.label === "activities" ? <Activities c={c} /> : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminListUser = ({
  popUp,
  setPopUp,
  usersOnTrip,
  tripId,
  setUsersOnTrip,
  setTrip,
  socket,
  setUser,
}) => {
  return (
    <>
      {popUp == true && (
        <div className="dest__popup__color">
          <div className="dest__popup__main">
            <div className="dest__popup__info">
              <p className="dest__title">Social Trip</p>
              <div className="icon__close">
                <AiFillCloseCircle onClick={() => setPopUp(false)} />
              </div>
            </div>

            {usersOnTrip.admin.map((adm) => (
              <div key={adm._id}>
                <AdminList
                  users={adm}
                  tripId={tripId}
                  setUsersOnTrip={setUsersOnTrip}
                  setTrip={setTrip}
                  socket={socket}
                  setUser={setUser}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const TrList = ({
  popUp,
  setPopUp,
  usersOnTrip,
  tripId,
  isAdmin,
  setUsersOnTrip,
  setTrip,
  setUser,
  socket,
}) => {
  return (
    <>
      {popUp == true && (
        <div className="dest__popup__color">
          <div className="dest__popup__main">
            <div className="dest__popup__info">
              <p className="dest__title">Social Trip</p>
              <div className="icon__close">
                <AiFillCloseCircle onClick={() => setPopUp(false)} />
              </div>
            </div>

            {usersOnTrip.travelers?.map((adm) => (
              <div key={adm._id}>
                <TravelersList
                  users={adm}
                  tripId={tripId}
                  isAdmin={isAdmin}
                  socket={socket}
                  setUsersOnTrip={setUsersOnTrip}
                  setTrip={setTrip}
                  setUser={setUser}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const UsersPopUp = ({
  popUp,
  setPopUp,
  users,
  tripId,
  setUser,
  socket,
  setArrival,
}) => {
  const [search, setSearch] = useState([]);

  return (
    <>
      {popUp == true && (
        <div className="pick__popup__color">
          <div className="pick__popup__main">
            <div className="dest__popup__info">
              <p className="dest__title">Social Trip</p>
              <div className="icon__close">
                <AiFillCloseCircle onClick={() => setPopUp(false)} />
              </div>
            </div>

            <input
              type="text"
              className="dash__search"
              placeholder="Search By Email"
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="dest__list__main">
              {users
                ?.filter((val) => {
                  if (search == "") {
                    return val;
                  } else if (
                    val.email.toLowerCase().includes(search.toLocaleLowerCase())
                  ) {
                    return val;
                  }
                })
                .map((data) => (
                  <div key={data._id}>
                    <UsersList
                      setArrival={setArrival}
                      data={data}
                      tripId={tripId}
                      setUser={setUser}
                      socket={socket}
                      users={users}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Activities = ({ c }) => {
  return (
    <div>
      <div className="obj__main">
        <div className="obj__color">
          <div className="obj__info">
            <img
              className="obj__img"
              src={c.img === "" ? Search : c.img}
              alt=""
            />
            <p className="obj__address">{c.address}</p>
            <div className="obj__bottom">
              <a target="_blank" className="obj__map" href={c?.url}>
                View on Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stays = ({ c }) => {
  return (
    <div>
      <div className="obj__main">
        <div className="obj__color">
          <div className="obj__info">
            <img
              className="obj__img"
              src={c.img === "" ? Search : c.img}
              alt=""
            />
            <p className="obj__address">{c.address}</p>
            <div className="obj__bottom">
              <a target="_blank" className="obj__map" href={c?.url}>
                View on Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Restaurant = ({ c }) => {
  return (
    <div>
      <div className="obj__main">
        <div className="obj__color">
          <div className="obj__info">
            <img
              className="obj__img"
              src={c.img === "" ? Search : c.img}
              alt=""
            />
            <p className="obj__address">{c.address}</p>
            <div className="obj__bottom">
              <a target="_blank" className="obj__map" href={c?.url}>
                View on Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Destination = ({ c }) => {
  return (
    <div>
      <div className="obj__main">
        <div className="obj__color">
          <div className="obj__info">
            <img
              className="obj__img"
              src={c.img === "" ? Search : c.img}
              alt=""
            />
            <p className="obj__address">{c.address}</p>
            <div className="obj__bottom">
              <a target="_blank" className="obj__map" href={c?.url}>
                View on Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
