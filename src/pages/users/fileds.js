export const userFields = [
  { name: "displayName", title: "Name", type: "text" },
  {
    name: "designation",
    title: "Designation",
    type: "select",
    values: [
      { value: "Web Developer", name: "Web Developer" },
      { value: "Java Developer", name: "Java Developer" },
      { value: "Developer", name: "Developer" },
      { value: " Windows developer", name: " Windows developer" },
      { value: "Programmer", name: "Programmer" },
      { value: "Systems Analyst", name: "Systems Analyst" },
      { value: "Software engineer", name: "Software engineer" },
      { value: "Fullstack Developer", name: "Fullstack Developer" },
      { value: "HR manager", name: "HR manager" },
      { value: "Android Developer", name: "Android Developer" },
      { value: "IOS Developer", name: "IOS Developer" },
      { value: "QA Engineer", name: "QA Engineer" },
      { value: "Test Manager", name: "Test Manager" },
      { value: "Test Engineer", name: "Test Engineer" },
      { value: "Test Analyst", name: "Test Analyst" },
      { value: "Test Automation Engineer", name: "Test Automation Engineer" },
    ],
  },
  { name: "employeeId", title: "Employee Id", type: "text" },
  { name: "ofcLocation", title: "Office Location", type: "text" },
  { name: "tempAddress", title: "Temp Address", type: "text" },
  { name: "permanentAddress", title: "Permanent Address", type: "text" },
  { name: "city", title: "City", type: "text" },
  { name: "state", title: "State", type: "text" },
  { name: "pinCode", title: "PinCode", type: "text" },
  // { name: "remainingLeave", title: "Remaining Leave", type: "text" },
  { name: "managerName", title: "Manager Name", type: "select" },
  { name: "mobileNumber", title: "Mobile Number", type: "text" },
  {
    name: "emergencyMobileNumber",
    title: "Emergency Mobile Number",
    type: "text",
  },
  {
    name: "gender",
    title: "Gender",
    type: "select",
    values: [
      { value: "Male", name: "Male" },
      { value: "Female", name: "Female" },
    ],
  },
  {
    name: "type",
    title: "Type",
    type: "select",
    values: [
      { value: "Contractor", name: "Contractor" },
      { value: "Permanent", name: "Permanent" },
    ],
  },
  {
    name: "department",
    title: "Department",
    type: "select",
    values: [
      { value: "Development", name: "Development" },
      { value: "Finance", name: "Finance" },
      { value: "Management", name: "Management" },
      { value: "Testing", name: "Testing" },
    ],
  },
  { name: "pan", title: "PAN", type: "text" },
  { name: "dob", title: "Date of Birth", type: "date" },
  { name: "doj", title: "Date of Joining", type: "date" },
  { name: "uan", title: "UAN", type: "text" },
  {
    name: "role",
    title: "Engineer Role",
    type: "select",
    values: [
      { value: 1, name: "User" },
      { value: 2, name: "Admin" },
    ],
  },
];
