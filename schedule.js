function formatTime(time) {
  let am = 'am';
  let hour = parseInt(time.split(':')[0]);

  if (hour > 12) {
    hour -= 12;
    am = 'pm';
  } else if (hour === 12) {
    am = 'pm';
  } else if (hour === 0) {
    hour = 12;
  }

  return `${hour}:${time.split(':')[1]}`;
}

function formatDelta(delta) {
  const units = ['h', 'm', 's'];
  const sizes = [3600, 60, 1];
  var result = '';
  delta /= 1000;

  for (let i = 0; i < units.length; i++) {
    let magnitude = Math.floor(delta / sizes[i]);

    if (magnitude > 0) {
      result += `${magnitude}${units[i]}`;
    }

    delta -= magnitude * sizes[i];
  }

  return result;
}

function getStatus(startTime, endTime) {
  const now = new Date();

  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  const timeStrs = [startTime, endTime]
  const timeObjs = [new Date(today.getTime()), new Date(today.getTime())];

  for (let i = 0; i < timeStrs.length; i++) {
    const split = timeStrs[i].split(':');
    timeObjs[i].setHours(parseInt(split[0]));
    timeObjs[i].setMinutes(parseInt(split[1]));
  }

  if (timeObjs[0].getTime() > now.getTime()) {
    return `(in ${formatDelta(timeObjs[0].getTime() - now.getTime())})`;
  } else if (timeObjs[1].getTime() > now.getTime()) {
    return `(${formatDelta(timeObjs[1].getTime() - now.getTime())} remaining)`;
  } else {
    return '(done)';
  }
}

function updateCountdowns() {
  const countdowns = document.getElementsByClassName('countdown');

  for (let i = 0; i < countdowns.length; i++) {
    const element = countdowns[i];
    const startTime = element.dataset.start;
    const endTime = element.dataset.end;
    element.innerText = `${formatTime(startTime)} - ${formatTime(endTime)} ${getStatus(startTime, endTime)}`;
  }
}

const scheduleDisplays = document.getElementsByClassName('schedule-view');
const scheduleRadios = document.getElementsByClassName('schedule-select');
for (let i = 0; i < scheduleRadios.length; i++) {
  scheduleRadios[i].addEventListener('click', function (e) {
    let domId = e.target.dataset.domid;
    for (let j = 0; j < scheduleDisplays.length; j++) {
      scheduleDisplays[j].style.display = 'none';
    }
    document.getElementById(domId).style.display = 'block';
  });
}

// Execute self-calling function so no global variables are saved
(function () {
  let now = new Date();
  let dayOfWeek = now.getDay();
  if (dayOfWeek === 1) {
    document.getElementById('artRadio').click();
  }
})();

const updateInterval = setInterval(updateCountdowns, 100);
