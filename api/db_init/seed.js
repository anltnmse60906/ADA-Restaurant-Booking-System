const Table = require("../models/Table");

Table.create([
  {
    name: "1",
    capacity: 2,
    location: "top-left",
    isSmoking: true,
  },
  {
    name: "2",
    capacity: 2,
    location: "top-left",
    isSmoking: true
  },
  {
    name: "3",
    capacity: 4,
    location: "top-left",
    isSmoking: true
  },
  {
    name: "4",
    capacity: 4,
    location: "top-left",
    isSmoking: true
  },
  {
    name: "5",
    capacity: 2,
    location: "top-left",
    isSmoking: true
  },
  {
    name: "6",
    capacity: 2,
    location: "top-left",
    isSmoking: true
  },
  {
    name: "7",
    capacity: 2,
    location: "top-right",
    isSmoking: true
  },
  {
    name: "8",
    capacity: 2,
    location: "top-right",
    isSmoking: true
  },
  {
    name: "9",
    capacity: 2,
    location: "top-right",
    isSmoking: true
  },
  {
    name: "10",
    capacity: 4,
    location: "top-right",
    isSmoking: true
  },
  {
    name: "11",
    capacity: 4,
    location: "top-right",
    isSmoking: true
  },
  {
    name: "12",
    capacity: 4,
    location: "top-right",
    isSmoking: true
  },
  {
    name: "13",
    capacity: 2,
    location: "top-right",
    isSmoking: true
  },
  {
    name: "14",
    capacity: 2,
    location: "top-right",
    isSmoking: true
  },
  {
    name: "15",
    capacity: 2,
    location: "top-right",
    isSmoking: true
  },
  {
    name: "16",
    capacity: 2,
    location: "right-bar",
    isSmoking: true
  },
  {
    name: "17",
    capacity: 2,
    location: "right-bar",
    isSmoking: true
  },
  {
    name: "18",
    capacity: 2,
    location: "right-bar",
    isSmoking: true
  },
  {
    name: "19",
    capacity: 2,
    location: "right-bar",
    isSmoking: true
  },
  {
    name: "20",
    capacity: 2,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "21",
    capacity: 2,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "22",
    capacity: 2,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "23",
    capacity: 2,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "24",
    capacity: 2,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "25",
    capacity: 2,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "26",
    capacity: 2,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "27",
    capacity: 2,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "28",
    capacity: 2,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "29",
    capacity: 2,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "30",
    capacity: 2,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "31",
    capacity: 2,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "32",
    capacity: 4,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "33",
    capacity: 4,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "34",
    capacity: 4,
    location: "left-kitchen",
    isSmoking: true
  },
  {
    name: "35",
    capacity: 4,
    location: "right-kitchen",
    isSmoking: true
  },
  {
    name: "36",
    capacity: 4,
    location: "right-kitchen",
    isSmoking: true
  },
  {
    name: "37",
    capacity: 4,
    location: "right-kitchen",
    isSmoking: true
  },
]).then((user) => {
  console.log(`created ${user} table`);
  process.exit();
}).catch((error) => {
  console.error(error);
  process.exit();
});
