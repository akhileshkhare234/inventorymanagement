import React, { memo, useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import Header from "../inventory/Header";
import { getMonthName, getMonths, getYears } from "../util.js";
import ProjetcList from "./ProjetcList";

function TimeSheetDetails({ projects, getMonthValue, getYearValue }) {
  const [userInfo, setUserInfo] = useState([]);
  const getUsers = useCallback(() => {
    let tokenValue = window.localStorage.getItem("am_token");
    fetch(APIUrl + "api/user/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenValue,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUserInfo(res);
        console.log("User Profile : ", res);
      })
      .catch((err) => {
        console.log("User Not Get : ", err);
      });
  }, []);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  return (
    <>
      <Header title="Time Sheet Details" />
      <div className="container">
        {/* <hr className="mb-3" /> */}
        <dl className="row mb-1">
          <dt className="col-sm-2">User Name</dt>
          <dd className="col-sm-4">
            {userInfo.displayName ? userInfo.displayName : "-"}
          </dd>
          <dt className="col-sm-2">Email-id</dt>
          <dd className="col-sm-4">{userInfo.email ? userInfo.email : "-"}</dd>
        </dl>
        <dl className="row mb-1">
          <dt className="col-sm-2">Month</dt>
          <dd className="col-sm-4">
            {/* {getMonthName()} */}
            <select
              className="form-select rounded-3"
              name="months"
              defaultValue={getMonthName()}
              onChange={(event) => getMonthValue(event.target.value)}
            >
              {getMonths().map((month, index) => (
                <option
                  value={month}
                  selected={month === getMonthName()}
                  key={index + month}
                >
                  {month}
                </option>
              ))}
            </select>
          </dd>
          <dt className="col-sm-2">Year</dt>
          <dd className="col-sm-4">
            <select
              className="form-select rounded-3"
              name="years"
              defaultValue={getYears()}
              onChange={(e) => getYearValue(e.target.value)}
            >
              <option value={getYears() - 1}>{getYears() - 1}</option>
              <option value={getYears()} selected>
                {getYears()}
              </option>
            </select>
          </dd>
        </dl>
        <dl className="row mb-1">
          <dt className="col-sm-2">Projetcs</dt>
          <dd className="col-sm-4"></dd>
          <dt className="col-sm-2">Status</dt>
          <dd className="col-sm-4">Open</dd>
        </dl>
        <dl className="row mb-0">
          <dd className="col-sm">
            <ProjetcList projects={projects} />
          </dd>
        </dl>
      </div>
    </>
  );
}
export default memo(TimeSheetDetails);
