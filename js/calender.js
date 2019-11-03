class calenderItem {
  constructor(id, text, description, date, customer) {
    this.id = id;
    this.text = text;
    this.description = description;
    this.date = date;
    this.customer = customer;
  }
}
class dateTime {
  constructor(day, month, year, hours, minutes) {
    this.day = day;
    this.month = month;
    this.year = year;
    (this.hours = hours), (this.minutes = minutes);
  }
}

class eventList {
  constructor() {
    this.list = [];
    this.id = 1;
  }
}

class element {
  constructor(id, element) {
    this.id = id;
    this.element = element;
  }
}

this.elements = [];

let testList = new eventList();
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
let days = [31, 28, 31, 30, 31, 31, 30, 31, 30, 31, 30, 31];

let month = new Date().getMonth();
let year = new Date().getFullYear();

const customer = JSON.parse(localStorage.getItem("Customers"));
const select = document.querySelector("#chooseCustomerId");

$(document).ready(function() {
  //$("#datetimepicker1").datetimepicker();
  $("#datetimepicker1")
    .datetimepicker({
      sideBySide: true,
      showClose: true,
      icons: {
        time: "fas fa-clock-o",
        date: "fas fa-calendar",
        up: "fas fa-arrow-up",
        down: "fas fa-arrow-down",
        previous: "fas fa-chevron-left",
        next: "fas fa-chevron-right",
        today: "fas fa-calendar-check-o",
        clear: "fas fa-delete",
        close: "fas fa-times"
      }
    })
    .data("DateTimePicker")
    .showClose(true);

  displayMonth();
  scrollMonth();
  saveData();
  modal();
});

function scrollMonth() {
  $(".icon").click(function() {
    if ($(this).hasClass("next")) {
      month++;
      if (month == months.length) {
        month = 0;
        year++;
      }
      $("td").empty();
      displayMonth();
      makeElements();
    } else if ($(this).hasClass("previous")) {
      month--;
      if (month == -1) {
        month = months.length - 1;
        year--;
      }
      $("td").empty();
      displayMonth();
      makeElements();
    }
  });
}

function modal() {
  $("#save").click(function() {
    addEvent();
    $("#myModal").modal("hide");
  });

  $(document).on("show.bs.modal", function() {
    $("#txtEvent").val("Enter Event Title");
    $("#txtEvent").click(function() {
      $(this).val("");
    });
    let today = new Date();
    let date =
      today.getFullYear() +
      "/" +
      (today.getMonth() + 1) +
      "/" +
      today.getDate();
    let time = today.getHours() + ":" + today.getMinutes();
    let dT = date + " " + time;
    $("#date").val(dT);
    $("#descriptionEvent").val("");
  });
  for (let customerOption of customer) {
    select.options.add(
      new Option(customerOption.name + " " + customerOption.lastname)
    );
  }
}

function removeItem(id) {
  for (item of list) {
    if (id == item.id) {
      let place = list.indexOf(item);
      list.splice(place, 1);
      elements.splice(place, 1);
    }
  }
  setID();
  localStorage.setItem("ID", JSON.stringify(testList.id));
  localStorage.setItem("events", JSON.stringify(this.list));
  saveData();
}

function setID() {
  let i = 1;
  for (item of list) {
    for (el of elements) {
      if (el.id == item.id) {
        el.id = i;
      }
    }
    item.id = i;
    i++;
  }
  testList.id = i - 1;
}

function addEvent() {
  let selectedDate = formatDate($("#date").val());
  let drop_val = select.options[select.selectedIndex].value;
  let x = new calenderItem(
    testList.id,
    $("#txtEvent").val(),
    $("#descriptionEvent").val(),
    selectedDate,
    drop_val
  );
  saveData(x);
}

function formatDate(date) {
  date = new Date(date);
  let day = date.getDate() - 1;
  let month = date.getMonth();
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  return new dateTime(day, month, year, hours, minutes);
}

function getData() {
  if (
    JSON.parse(localStorage.getItem("events")) != null &&
    JSON.parse(localStorage.getItem("ID") != null)
  ) {
    this.list = JSON.parse(localStorage.getItem("events"));
    testList.id = JSON.parse(localStorage.getItem("ID"));
  } else {
    this.list = [];
  }
  return this.list;
}

function saveData(newEvent) {
  this.list = getData();
  testList.id++;
  if (newEvent != undefined && newEvent.text != "") {
    list.push(newEvent);
  }
  localStorage.setItem("ID", JSON.stringify(testList.id));
  localStorage.setItem("events", JSON.stringify(this.list));
  this.list = getData();
  makeElements();
}

function makeElements() {
  elements = [];
  for (item of list) {
    let el = document.createElement("li");
    el.classList.add("list-group-item", "list-group-item-info", "py-1");
    el.setAttribute("id", item.id);

    let hours = item.date.hours;
    let minutes = item.date.minutes;

    if (item.date.hours < 10) {
      hours = "0" + item.date.hours;
    }
    if (item.date.minutes < 10) {
      minutes = "0" + item.date.minutes;
    }

    if (item.text.length > 10) {
      el.innerHTML =
        hours + ":" + minutes + " " + item.text.slice(0, 20) + "...";
    } else {
      el.innerHTML = hours + ":" + minutes + " " + item.text;
    }
    elements.push(new element(item.id, el));
  }
  sortElements();
  showCalItems();
}

function sortElements() {
  let max = list.length - 1;
  for (i = 0; i < max; i++) {
    let left = max - i;
    for (j = 0; j < left; j++) {
      if (list[j].date.hours > list[j + 1].date.hours) {
        let temp = list[j];
        list[j] = list[j + 1];
        list[j + 1] = temp;
      } else if (list[j].date.hours == list[j + 1].date.hours) {
        if (list[j].date.minutes > list[j + 1].date.minutes) {
          let temp = list[j];
          list[j] = list[j + 1];
          list[j + 1] = temp;
        }
      }
    }
  }
}

function daysOfMonth(month, year) {
  if (month == 1 && year % 4 == 0 && year % 100 == 0 && year % 400 == 0) {
    return 29;
  } else {
    return days[month];
  }
}

function showCalItems() {
  let i = 1;
  $("td").each(function() {
    if ($(this).children().length > 0) {
      let ul = $(this).children();
      ul.empty();
      let more = document.createElement("li");
      more.classList.add("list-group-item", "list-group-item-info", "py-1");
      more.innerHTML = "...";

      for (item of list) {
        if (
          item.date.month == month &&
          item.date.year == year &&
          item.date.day == i - 1
        ) {
          if (ul.children().length > 2) {
            ul.append(more);
          } else {
            let li;
            jQuery.each(elements, function() {
              if (item.id == $(this)[0].id) {
                li = $(this)[0].element;
              }
              ul.append(li);
            });
          }
        }
      }
      i++;
    }
    calItemClick();
  });
}

function calItemClick() {
  $("table")
    .find("li")
    .each(function() {
      $(this).click(stopEvent);
      let i;
      if ($(this)[0].id.length > 0) {
        let el = this;
        for (item of list) {
          if (item.id == el.id) {
            i = item;
          }
        }
        $(this).click(function() {
          let hours = i.date.hours;
          let minutes = i.date.minutes;

          if (i.date.hours < 10) {
            hours = "0" + i.date.hours;
          }
          if (i.date.minutes < 10) {
            minutes = "0" + i.date.minutes;
          }
          $("#myModal2")
            .on("show.bs.modal", function() {
              $(".calender-items").addClass("hide");
              $(".calender-items").empty();
              let modal = $(this);
              $(".modal-title-calender").html(i.text);
              $(".calender-date").html(
                "Date : " +
                  (i.date.day + 1) +
                  " " +
                  months[i.date.month] +
                  " " +
                  i.date.year
              );
              $(".calender-time").html("Time : " + hours + ":" + minutes);
              $(".calender-item-text").html(
                "Description : <br>" + i.description
              );
              $("#delete").css("visibility", "visible");
              $("#delete").on("click", function() {
                modal.modal("hide");
                removeItem(el.id);
              });
            })
            .modal("show");
        });
      } else if ($(this)[0].id.length == 0) {
        $(this).click(function() {
          let el = $(this);
          $("#myModal2")
            .on("show.bs.modal", function() {
              showDay(el);
            })
            .modal("show");
          $(".calender-items")
            .find("li")
            .each(function() {
              $(this).click(function() {
                showItem(this);
              });
            });
        });
      }
    });
}
function showDay(el) {
  $(".calender-items").removeClass("hide");
  $(".calender-items").empty();
  $(".modal-title-calender").html(el.parent()[0].id + " " + months[month]);
  $(".calender-item-title").html("");
  $(".calender-item-text").html("");
  $(".calender-date").html("");
  $(".calender-time").html("");

  for (item of list) {
    if (
      item.date.month == month &&
      item.date.year == year &&
      item.date.day == el.parent()[0].id - 1
    ) {
      let li;
      jQuery.each(elements, function() {
        if (item.id == $(this)[0].id) {
          li = $(this)[0].element;
          li = li.cloneNode(true);
          li.classList.remove("list-group-item-info");
          li.classList.add("p-3");

          let hours = item.date.hours;
          let minutes = item.date.minutes;

          if (item.date.hours < 10) {
            hours = "0" + item.date.hours;
          }
          if (item.date.minutes < 10) {
            minutes = "0" + item.date.minutes;
          }
          li.innerHTML = hours + ":" + minutes + " " + item.text;
        }
      });
      $(".calender-items").append(li);
    }
  }
  $("#delete").css("visibility", "hidden");
}

function showItem(test) {
  let i;
  $(".calender-items").empty();
  let el = test;
  for (item of list) {
    if (item.id == el.id) {
      i = item;
    }
  }

  let hours = i.date.hours;
  let minutes = i.date.minutes;

  if (i.date.hours < 10) {
    hours = "0" + i.date.hours;
  }
  if (i.date.minutes < 10) {
    minutes = "0" + i.date.minutes;
  }

  $(".calender-items").addClass("hide");
  $(".modal-title-calender").html(i.text);
  $(".calender-date").html(
    "Date : " +
      (i.date.day + 1) +
      " " +
      months[i.date.month] +
      " " +
      i.date.year
  );
  $(".calender-time").html("Time : " + hours + ":" + minutes);
  $(".calender-item-text").html("Description : <br>" + i.description);
  $("#delete").css("visibility", "visible");
  $("#delete").on("click", function() {
    removeItem(el.id);
    $(".calender-item-title").html("");
    $(".calender-item-text").html("");
  });
}

function stopEvent(ev) {
  ev.stopPropagation();
}

function displayMonth() {
  let week = 0;
  let startDay = new Date(year, month, 1).getDay() - 1;
  if (startDay == -1) {
    startDay = 6;
  }
  $(".month").html(months[month]);
  $(".year").html(year);
  for (j = 0; j < daysOfMonth(month, year); j++) {
    if ((j + new Date(year, month, 1).getDay() - 1) % 7 == 0) {
      week++;
    } else if ($("._" + week).children()[startDay] == undefined) {
      week++;
    }
    let td = $("._" + week).children()[startDay];
    td.innerHTML = j + 1;
    startDay++;
    if (startDay == 7) {
      startDay = 0;
    }
  }
  fillTable();
}

function fillTable() {
  $("td").each(function() {
    if ($(this).html().length > 0) {
      let ul = document.createElement("ul");
      ul.classList.add("list-group-flush");
      ul.setAttribute("id", this.innerHTML);
      $(this).append(ul);
      $(this).on("click", function() {
        $("#myModal")
          .modal({
            backdrop: "static",
            keyboard: true
          })
          .modal("show");
      });
    }
  });
  $("tbody tr").each(function() {
    this.style.visibility = "visible";
    let row = 0;
    $(this)
      .children()
      .each(function() {
        if ($(this).children().length == 0) {
          row++;
        }
      });
    if (row == 7) {
      this.style.visibility = "hidden";
    }
  });
}
