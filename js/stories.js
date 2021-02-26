"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  //loop through user favorites and change story favorite to true
  storyList.refreshFavorites();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="far fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

$(".stories-container").on("click", ".far", updateStarUI)

function updateStarUI(evt) {
  let currentStarClass = $(evt.target).attr("class");
  let parentId = $(evt.target).parent().attr("id");
  $(evt.target).toggleClass("fas");
  updateFavoriteOnClick(currentStarClass, parentId)
}

function updateFavoriteOnClick(starClass, parentId) {
  for(let story of storyList.stories) {
    if(parentId === story.storyId && starClass === "far fa-star") {
      currentUser.addFavorite(story)
    }
    if(parentId === story.storyId && starClass === "far fa-star fas") {
      currentUser.removeFavorite(story)
    }
  }
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

$("#nav-favorites").on("click", putFavoriteStoriesOnPage)

function putFavoriteStoriesOnPage() {
  $allStoriesList.empty();
    console.log("hi")
    for(let story of storyList.stories) {
      if(story.favorite) {

        const $story = generateStoryMarkup(story);
        $allStoriesList.append($story);
      }
    }
}

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//Get's input from submit form and calls addStory

$("#new-story-form").on("submit", addStoryFromForm);

async function addStoryFromForm(evt) {
  evt.preventDefault();
  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();
  await storyList.addStory(currentUser, {title,author,url});

  putStoriesOnPage();
  $("#new-story-form").trigger("reset");
  $submitForm.toggle();
}
