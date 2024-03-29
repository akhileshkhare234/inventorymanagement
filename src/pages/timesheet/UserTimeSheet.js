import React, {
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { APIUrl } from "../../auth/constants";
import {
  getMonthDates,
  getMonthName,
  getYears,
  monthNames,
  getDateBySelection,
  parseDate,
} from "../util";
import TimeSheetDetails from "./TimeSheetDetails";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../inventory/Header";
import Loader from "../../util/Loader";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../App";
function UserTimeSheet() {
  const userInfo = useContext(UserData);
  const [projects, setProjects] = useState([]);
  const [projectstatus, setProjectstatus] = useState(false);
  const [totalHour, setTotalHour] = useState({});
  const [totalHoursValue, setTotalHoursValue] = useState(0);
  const [timeSheetData, setTimeSheetData] = useState({});
  const [timesheetForm, setTimeSheetForm] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const navigate = useNavigate();
  // Get Users List code
  const getUsers = useCallback(() => {
    if (
      userInfo.userProjectWithAssignedDate &&
      userInfo.userProjectWithAssignedDate.length > 0
    )
      setProjectstatus(false);
    else setProjectstatus(true);
    console.log("userInfo : ", userInfo);
  }, [userInfo]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  //Save Timesheet code
  const saveTimeSheet = (e) => {
    e.preventDefault();
    let fieldFilled = [];
    let payloadData = projects.map((project) => {
      let payload = {
        projectId: project.projectId,
        projectName: project.name,
        detail: [],
        comment: "",
        status: "InProgress",
        totalHour: totalHoursValue,
      };
      let countHours = 0;
      let taskDetails = getMonthDates(
        monthNames.indexOf(selectedMonth ? selectedMonth : getMonthName()) + 1,
        selectedYear ? selectedYear : getYears(),
        projects,
        selectedMonth !== null && selectedMonth !== getMonthName()
          ? "Other"
          : "Current",
        "All"
      ).map((data) => {
        let rowdata = data.details.filter(
          (row) => row.projectId === project.projectId
        )[0];
        if (
          parseInt(e.target[rowdata["hour"]].value) > 0 &&
          !e.target[rowdata["task"]].value
        ) {
          e.target[rowdata["task"]].focus();
          e.target[rowdata["task"]].style.borderColor = "red";
          fieldFilled.push(false);
        } else if (
          (e.target[rowdata["task"]].value &&
            isNaN(parseInt(e.target[rowdata["hour"]].value))) ||
          (e.target[rowdata["task"]].value &&
            parseInt(e.target[rowdata["hour"]].value) === 0)
        ) {
          fieldFilled.push(false);
          e.target[rowdata["hour"]].focus();
          e.target[rowdata["hour"]].style.borderColor = "red";
        } else {
          fieldFilled.push(true);
          e.target[rowdata["task"]].style.borderColor = "#ced4da";
          e.target[rowdata["hour"]].style.borderColor = "#ced4da";
        }
        let hourValue = e.target[rowdata["hour"]].value;
        countHours += hourValue ? parseInt(hourValue) : 0;
        return {
          day: data.day,
          task: e.target[rowdata["task"]].value,
          hour: parseInt(hourValue) > 0 ? hourValue : "",
          comment: "",
        };
      });
      payload.detail = [...taskDetails];
      payload.totalHour = countHours;
      return payload;
    });
    let timeSheetPayload = {
      userName: userInfo?.userName,
      email: userInfo?.email,
      month: selectedMonth ? selectedMonth : getMonthName(),
      year: selectedYear ? selectedYear : getYears(),
      status: "InProgress",
      projectIds: projects.map((row) => row.projectId).join("|"),
      submitDate: new Date(),
      totalHour: totalHoursValue,
      comment: "",
      data: [...payloadData],
    };
    console.log("timeSheetPayload : ", timeSheetPayload);
    if (fieldFilled.filter((field) => !field).length === 0) {
      let tokenValue = window.localStorage.getItem("am_token");
      fetch(APIUrl + "api/timesheet/", {
        method: "POST",
        body: JSON.stringify(timeSheetPayload),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenValue,
        },
      })
        .then((res) => {
          console.log("Update TimeSheet : ", res);
        })
        .catch((err) => {
          console.log("TimeSheet Not Update : ", err);
        });
      console.log("Valid data : ", fieldFilled);
      toast.success("Save TimeSheet Successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
      });
    } else {
      toast.warn(
        "Fill the details of both task and hours for the respective date.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "colored",
        }
      );
    }
  };
  //Update Timesheet code
  const updateTimeSheet = (e) => {
    e.preventDefault();
    let fieldFilled = [];
    console.log("TimeSheet Data ", e.target, projects);
    let timeSheetValue = null;
    projects.forEach((project) => {
      timeSheetValue = timeSheetData.data.filter(
        (row) => row.projectId === project.projectId
      )[0];
    });
    let countHours = 0;
    let payloadNewData = projects.map((project) => {
      // if (timeSheetData.projectIds?.includes(project.projectId)) {
      timeSheetValue = timeSheetData.data.filter(
        (row) => row.projectId === project.projectId
      )[0];
      console.log("timeSheetValue : ", timeSheetValue);
      let payload = null;
      if (timeSheetValue === undefined)
        payload = {
          projectId: project.projectId,
          projectName: project.name,
          detail: [],
          comment: project.comment,
          status: "InProgress",
          totalHour: 0,
        };
      else
        payload = {
          projectId: timeSheetValue.projectId,
          projectName: timeSheetValue.name,
          detail: [],
          id: timeSheetValue.id,
          comment: timeSheetValue.comment,
          status: timeSheetValue.status,
          totalHour: project.totalHour,
        };

      let taskDetails = getMonthDates(
        monthNames.indexOf(selectedMonth ? selectedMonth : getMonthName()) + 1,
        selectedYear ? selectedYear : getYears(),
        projects,
        selectedMonth !== null && selectedMonth !== getMonthName()
          ? "Other"
          : "Current",
        "All"
      ).map((data) => {
        let rowData = data.details.filter(
          (row) => row.projectId === project.projectId
        )[0];
        if (
          parseInt(e.target[rowData["hour"]].value) > 0 &&
          !e.target[rowData["task"]].value
        ) {
          e.target[rowData["task"]].focus();
          e.target[rowData["task"]].style.borderColor = "red";
          fieldFilled.push(false);
        } else if (
          (e.target[rowData["task"]].value &&
            isNaN(parseInt(e.target[rowData["hour"]].value))) ||
          (e.target[rowData["task"]].value &&
            parseInt(e.target[rowData["hour"]].value) === 0)
        ) {
          fieldFilled.push(false);
          e.target[rowData["hour"]].focus();
          e.target[rowData["hour"]].style.borderColor = "red";
        } else {
          fieldFilled.push(true);
          e.target[rowData["task"]].style.borderColor = "#ced4da";
          e.target[rowData["hour"]].style.borderColor = "#ced4da";
        }
        return data.id > 0
          ? {
              id: data.id,
              day: data.day,
              task: e.target[rowData["task"]].value,
              hour: e.target[rowData["hour"]].value,
              comment: "",
            }
          : {
              day: data.day,
              task: e.target[
                data.details.filter(
                  (row) => row.projectId === project.projectId
                )[0]["task"]
              ].value,
              hour: e.target[
                data.details.filter(
                  (row) => row.projectId === project.projectId
                )[0]["hour"]
              ].value,
              comment: "",
            };
      });
      payload.detail = [...taskDetails];
      countHours += parseInt(payload.totalHour);
      return payload;
      // } else {
      //   return {};
      // }
    });
    console.log("updateTimeSheet payloadNewData : ", payloadNewData);
    let timeSheetPayload = {
      userName: timeSheetData.userName,
      email: timeSheetData.email,
      month: timeSheetData.month,
      year: timeSheetData.year,
      status: "InProgress",
      projectIds: timeSheetData.projectIds,
      submitDate: new Date(),
      totalHour: countHours,
      comment: timeSheetData.comment,
      id: timeSheetData.id,
      data: [...payloadNewData.filter((data) => Object.keys(data).length > 0)],
    };
    console.log("Update payloadNewData : ", timeSheetPayload);
    if (fieldFilled.filter((field) => !field).length === 0) {
      let tokenValue = window.localStorage.getItem("am_token");
      fetch(APIUrl + "api/timesheet/" + timeSheetData.id, {
        method: "PUT",
        body: JSON.stringify(timeSheetPayload),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenValue,
        },
      })
        .then((res) => {
          console.log("Update TimeSheet : ", res);
        })
        .catch((err) => {
          console.log("TimeSheet Not Update : ", err);
        });
      toast.success("TimeSheet Update Successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
      });
    } else {
      toast.warn(
        "Fill the details of both task and hours for the respective date.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "colored",
        }
      );
    }
  };
  //set Hours Value onChange Text code
  const setHoursValue = (fieldName) => {
    console.log("onChange Call ", projects);
    let colIndex = -1;
    // eslint-disable-next-line array-callback-return
    let hourRow = getMonthDates(
      monthNames.indexOf(selectedMonth ? selectedMonth : getMonthName()) + 1,
      selectedYear ? selectedYear : getYears(),
      projects,
      selectedMonth !== null && selectedMonth !== getMonthName()
        ? "Other"
        : "Current",
      "All"
    ).filter(
      // eslint-disable-next-line array-callback-return
      (data) => {
        if (
          // eslint-disable-next-line array-callback-return
          data.details.filter((row, ind) => {
            if (row.hour === fieldName) {
              colIndex = ind;
              return row;
            }
          }).length > 0
        )
          return data;
      }
    );
    let timesheet = document.forms["timesheet"];
    let hourCol = {};
    let totalHourValue = 0;
    getMonthDates(
      monthNames.indexOf(selectedMonth ? selectedMonth : getMonthName()) + 1,
      selectedYear ? selectedYear : getYears(),
      projects,
      selectedMonth !== null && selectedMonth !== getMonthName()
        ? "Other"
        : "Current",
      "All"
    ).forEach((data) => {
      hourCol[data.details[colIndex].hour] =
        timesheet[data.details[colIndex].hour].value;
      if (timesheet[data.details[colIndex].hour].value > 0)
        totalHourValue += parseFloat(
          timesheet[data.details[colIndex].hour].value
        );
    });
    let hoursValue = 0;
    let tempProjects = projects.map((row) => {
      if (row.projectId === parseInt(fieldName.split("_")[2])) {
        row.totalHour = totalHourValue;
        hoursValue += totalHourValue;
      }
      return row;
    });
    setTotalHoursValue(hoursValue);
    console.log("User Project List Data : ", projects, tempProjects);
    setProjects([...tempProjects]);
    if (hourRow.length > 0) {
      let sum = 0;
      hourRow[0].details.forEach((row) => {
        if (timesheet[row.hour].value > 0)
          sum += parseFloat(timesheet[row.hour].value);
        else sum += 0;
      });
      totalHour["day_" + hourRow[0].day] = sum;
      setTotalHour(totalHour);
    }
  };

  //get Timesheet Data from Selected Month and Year Values
  const getTimeSheet = useCallback(
    (monthname, yearvalue) => {
      let tokenValue = window.localStorage.getItem("am_token");
      let timesheet = document.forms["timesheet"];
      console.log("timesheet Form : ", timesheet);
      userInfo &&
        tokenValue &&
        fetch(APIUrl + `api/timesheet/${yearvalue}/${monthname}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenValue,
          },
        })
          .then((res) => {
            if (res.status === 401) {
              window.localStorage.removeItem("am_token");
              navigate("/");
            } else return res.json();
          })
          .then((res) => {
            timesheet?.reset();
            setTimeSheetForm(timesheet);
            console.log(
              "timesheet Projects",
              res,
              userInfo?.userProjectWithAssignedDate,
              timesheetForm
            );
            if (
              userInfo?.userProjectWithAssignedDate &&
              userInfo?.userProjectWithAssignedDate.length > 0
            ) {
              //Checking the Selected Month/Year is valid for Assigned ProjectDate
              let currentDate = getDateBySelection(selectedMonth, selectedYear);

              let currentMonthProject =
                userInfo?.userProjectWithAssignedDate?.filter((project) => {
                  let projectDate = parseDate(
                    new Date(project.projectAssignedDate).toLocaleDateString()
                  );
                  return projectDate <= currentDate;
                });
              console.log(
                userInfo?.userProjectWithAssignedDate,
                currentMonthProject
              );
              if (currentMonthProject.length > 0) {
                let projectData = userInfo?.userProjectWithAssignedDate.map(
                  (row) => {
                    row["totalHour"] = 0;
                    return row;
                  }
                );
                let hours = {};
                getMonthDates(
                  monthNames.indexOf(
                    selectedMonth ? selectedMonth : getMonthName()
                  ) + 1,
                  selectedYear ? selectedYear : getYears(),
                  projectData,
                  selectedMonth !== null && selectedMonth !== getMonthName()
                    ? "Other"
                    : "Current",
                  "All"
                ).forEach((data) => {
                  hours["day_" + data.day] = 0;
                });
                setTotalHour(hours);

                let projectIds = projectData.map((row) => row.projectId);
                if (res.month !== null) {
                  res?.data?.forEach((row) => {
                    console.log("row.projectId Value ", row.projectId);
                    row.detail.forEach((data) => {
                      // console.log("Project Details : ", data, row.projectId);
                      if (`hour_${data.day}_${row?.projectId}` in timesheet) {
                        timesheet[`hour_${data.day}_${row.projectId}`].value =
                          data.hour;
                        let sum = 0;
                        let myarrays = projectIds?.map((ids) =>
                          ids && timesheet[`hour_${data.day}_${ids}`]?.value > 0
                            ? parseFloat(
                                timesheet[`hour_${data.day}_${ids}`]?.value
                              )
                            : 0
                        );
                        if (myarrays.length > 0)
                          myarrays.reduce((p, n) => p + n);
                        hours["day_" + data.day] = sum;
                      }
                      if (timesheet[`task_${data.day}_${row.projectId}`])
                        timesheet[`task_${data.day}_${row.projectId}`].value =
                          data.task;
                    });
                  });
                  let tempProjects = projectData?.map((row, index) => {
                    row.totalHour = res.data.filter(
                      (proj) => proj.projectId === row.projectId
                    )[0]?.totalHour;
                    return row;
                  });
                  let curProjects = [...tempProjects];
                  console.log(
                    "tempProjects : ",
                    tempProjects,
                    projectData,
                    res.data,
                    curProjects
                  );
                  setProjects([...curProjects]);
                } else {
                  setProjects([...projectData]);
                }
              } else {
                setProjects([]);
              }
            }
            setTimeSheetData(res);
          })
          .catch((err) => console.log("TimeSheet Data Not Get : ", err));
    },
    [userInfo, navigate, timesheetForm, selectedMonth, selectedYear]
  );
  useEffect(() => {
    let monthname = getMonthName();
    console.log(
      monthname,
      selectedYear ? selectedYear : getYears(),
      monthNames.indexOf(selectedMonth ? selectedMonth : getMonthName()) + 1
    );
    getTimeSheet(
      selectedMonth ? selectedMonth : getMonthName(),
      selectedYear ? selectedYear : getYears()
    );
  }, [getTimeSheet, selectedMonth, selectedYear, userInfo, timesheetForm]);
  useEffect(() => {
    console.log("totalHour Change ", totalHour);
  }, [totalHour]);
  const getMonthValue = (monthname) => {
    setSelectedMonth(monthname ? monthname : getMonthName());
    getTimeSheet(monthname, selectedYear ? selectedYear : getYears());
  };
  const getYearValue = (yearvalue) => {
    setSelectedYear(yearvalue ? yearvalue : getYears());
    getTimeSheet(selectedMonth ? selectedMonth : getMonthName(), yearvalue);
  };
  return userInfo?.userProjectWithAssignedDate?.length > 0 ? (
    <>
      <TimeSheetDetails
        projects={projects}
        getMonthValue={(value) => getMonthValue(value)}
        getYearValue={(value) => getYearValue(value)}
      />
      <ToastContainer />
      <div>
        <form
          name="timesheet"
          onSubmit={
            timeSheetData.month === null ? saveTimeSheet : updateTimeSheet
          }
        >
          {projects.length > 0 ? (
            <>
              <div className="timesheet">
                Time Sheet : {selectedMonth ? selectedMonth : getMonthName()} /
                {selectedYear ? selectedYear : getYears()}
              </div>
              <button type="submit" className="btn btn-primary saveBtn">
                {timeSheetData.month === null ? "Save" : "Update"}
              </button>
              <div
                style={{
                  overflow: "scroll",
                  height: "364px",
                  clear: "both",
                  margin: "0px 15px 10px 15px",
                }}
              >
                <table
                  className={
                    projects.length > 3
                      ? "table tabletext timesheettable tablelarge"
                      : "table tabletext timesheettable tablesmall"
                  }
                  style={{
                    margin: projects?.length,
                  }}
                >
                  <thead className="sticky-header">
                    <tr>
                      <th scope="col" colSpan={1}>
                        Projects
                      </th>
                      {projects.map((project, index) => (
                        <th
                          scope="col"
                          key={project.name + index}
                          colSpan="2"
                          className="text-center"
                        >
                          {project.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {console.log(
                      selectedMonth,
                      getMonthName(),
                      selectedMonth !== null && selectedMonth !== getMonthName()
                    )}
                    {getMonthDates(
                      monthNames.indexOf(
                        selectedMonth ? selectedMonth : getMonthName()
                      ) + 1,
                      selectedYear ? selectedYear : getYears(),
                      projects,
                      selectedMonth !== null && selectedMonth !== getMonthName()
                        ? "Other"
                        : "Current",
                      "All"
                    ).map((data, index) => (
                      <tr key={index + data.day}>
                        <th
                          style={{ width: "70px" }}
                          className="text-center verticalAlign fixed-col"
                        >
                          <div className="bgColor textColor dateStyle">
                            <div>{data.day}</div>
                            <div>{data.dayName}</div>
                          </div>
                        </th>
                        {data.details.map((row) => (
                          <Fragment key={row.hour}>
                            <td className="inputSize inputSize-1">
                              <input
                                type="number"
                                name={row.hour}
                                onChange={(event) =>
                                  setHoursValue(event.target.name)
                                }
                                className="form-control rounded-3 hoursinput"
                                placeholder="Hrs"
                                min="0"
                                max="24"
                                step="1"
                                autoComplete="off"
                                onInput={(event) => {
                                  event.target.value =
                                    Math.abs(Math.floor(event.target.value)) >
                                    24
                                      ? "0"
                                      : Math.abs(
                                          Math.floor(event.target.value)
                                        );
                                }}
                              />
                            </td>
                            <td className="inputSize textareaSize-1">
                              <textarea
                                multiline
                                type="text"
                                autoComplete="off"
                                name={row.task}
                                className="form-control rounded-3"
                                placeholder="Task Details"
                              />
                            </td>
                          </Fragment>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="row">
              <div className="col-12 text-center" style={{ color: "#0eb593" }}>
                No projects have been assigned in the{" "}
                {selectedMonth ? selectedMonth : getMonthName()}/
                {selectedYear ? selectedYear : getYears()}.
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  ) : projectstatus ? (
    <>
      <Header title="Time Sheet Details" />
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <h5 className="mt-4">No projects have been assigned to you.</h5>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loader msg="TimeSheet loading" />
  );
}
export default memo(UserTimeSheet);
