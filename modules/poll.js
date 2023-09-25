modules.poll = function (poll) {
  let pollHTML = ``;
  if (poll.Voted) {
    for (var i in poll.Options) {
      pollHTML += `<div class="pollStat">
        <div class="pollStatBar" style="width: calc(300px * ${poll.Options[i].Votes/poll.Total})">${Math.round((poll.Options[i].Votes/poll.Total)*100)}%</div>
        <div class="pollStatText">${poll.Options[i].Name}${poll.Options[i].Voted ? " &check;" : ""}</div>
      </div>`;
    }
    pollHTML += `<div class="pollTotal">${poll.Total} votes</div>`;
  } else {
    pollHTML = `<div class="pollOptions" id="poll${poll._id}"`;
    for (var i in poll.Options) {
      
    }
  }
}

/* Poll Structure
{
  Voted: boolean // If the user voted or not.
  Total: number // The total number of votes.
  Options: [
    {
      Name: string // The text of that option.
      Votes: number // The number of votes that option got.
      Voted: boolean // If the user voted for that option.
    }
  ]
}

*/